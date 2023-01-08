gcloud_list(){
    local gcloud="${gcloud app versions list}"
    local array=()
    for word in $gcloud
    do 
        array=($word)
    done
    echo "${array[@]}"
}


delete_version(){
    local array=($@)
    for ((i=0; i< ${#array[@]}; ++i)); do
        if[[${array[$i]}==*"0.00"*]]; then
            local version=${array[$i-1]}
            local command="gcloud -q app version delete $version"
            eval $command
        fi
    done
}

list =$(gcloud_list)
delete_version $list

gcloud  app deploy --stop-previous-version
