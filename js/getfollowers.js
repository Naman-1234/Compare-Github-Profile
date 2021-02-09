var res=""
async function getFollowers(url)
{
    const xhr=new XMLHttpRequest();
    xhr.open('GET',url)      
    
    xhr.onload=async function()
    {
        res=await xhr.response;
        res=JSON.parse(res)
        ret(res)
    }
    xhr.send()
    
}
function ret(res)
{
    return res;
}
module.exports=ret