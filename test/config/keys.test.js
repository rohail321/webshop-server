const assert =require('assert')
const config=require('../../config/keys')

describe('test config file',()=>{
    it('object of the config', async ()=>{
        assert.equal("object", typeof config)
    })
})