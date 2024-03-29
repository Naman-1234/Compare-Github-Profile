

//* Below are event Listeners
const btn1=document.getElementById("reposbtn1");
btn1.addEventListener("click",()=>{
    getRepo(document.getElementById('input1'),1)
})
const btn2=document.getElementById("reposbtn2");
btn2.addEventListener("click",()=>{
    getRepo(document.getElementById('input2'),2)
})


/* Several Uitilies Start from here:
    1. Sleep Function
    2. Function for Getting No of Followers
    3. A function for getting Number of Following
    4. A Function for Getting total number of repositories
    5. A function for Creating A span Tag with certain attributes.
    6. A function for Creating A anchor Tag with certain attributes.
*/
const brTag= ()=>{return document.createElement('br')};
//* A function to provide some sleep time in order to provide some time for second chart to appear
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  

async function createSpan()
{
    var span=document.createElement('span');
    span.style.display.fontsize="40px";
    return span;
}


async function getFollowers(element,url)
{
    const xhr=new XMLHttpRequest();
    xhr.open('GET',url)      
    var res=""
    xhr.onload=async function()
    {
        res=await xhr.response;
        //Server sends data in the form of string, Paring Object from it
        res=JSON.parse(res)
        //* Bcoz we are only interested in finding number of followers and not their additional thing
        res=res.length
        let span=await createSpan()
        span.appendChild(document.createTextNode(`Total Number of followers=${res}`));
        element.appendChild(brTag());
        element.appendChild(span);
        element.appendChild(brTag());
        
    }
    xhr.send()   
}
  

async function getFollowing(element,url)
{
    const xhr=new XMLHttpRequest();
    xhr.open('GET',url)      
    var res=""
    xhr.onload=async function()
    {
        res=await xhr.response;
        res=JSON.parse(res)
        //* Bcoz we are only interested in finding number of followers and not their additional thing
        res=res.length;
        element.appendChild(brTag());
        element.appendChild(document.createTextNode(`Total Number of following=${res}`));
    }
    xhr.send()
}


const getImgTag = (index, url) =>{
    const img = document.getElementById(`img${index}`);
    img.src=url;
    img.classList.add('circularimage');
}

const getAnchorTag = (url) =>{
    const aTag= document.createElement('a');
    aTag.setAttribute('href',url);
    aTag.appendChild(document.createTextNode('Link to the Profile'))
    aTag.appendChild(brTag());
    aTag.style.color="black";
    return aTag;
}
//Function for Drawing Chart

async function draw1(mymap,index)
{
    //Sleep is used in order to give it some time after one element
    await sleep(1000);
    google.charts.load('current', {'packages':['corechart']});
    await google.charts.setOnLoadCallback(drawChart);
    
    
    
    
    async function drawChart() {
        
    var t2darr=await Object.keys(mymap).map((ele)=>{
        const arr=[ele,mymap[ele]]
        return arr
    }
    )
   
    var para=await t2darr.map((ele)=>{
        return ele
    });
    para.unshift(['Task',' Hours Per Day'])
    var data = google.visualization.arrayToDataTable(para);
    var options = {
        title: 'Languages used ',
        is3D:true,
        backgroundColor:'none',
        legend:{
            textstyle:{
                color:'white'
            }
        }
      };
      var chart = new google.visualization.PieChart(document.getElementById(`piechart${index}`));

        chart.draw(data, options);
    }   
}





async function afterload(name,value,url,res,index)
{
    // var res=this.response;
    res=JSON.parse(res);
    var mymap={}
    res.forEach(element => {
        //* In this what i have done is considered only those repos which is solo of his, Means do not contains any other contributor.
        if(element.fork!==true)
        {
            //* In this case we have to call to another url which will be language_url of that repo
            const xhr=new XMLHttpRequest();
            // const name=document.getElementById('input1').value;
            const reponame=element.name
            const url=`https://api.github.com/repos/${value}/${reponame}/languages`
            xhr.open('GET',url);
            xhr.onload=function()
            {
                var ans=xhr.response;
                ans=JSON.parse(ans)
                for(const key of Object.keys(ans))
                {
                    const ele=ans[key]
                    mymap[key]=(mymap[key]||0)+ele
                }
            }
            xhr.send()
        }
    });
    const parent=name.parentElement;
    await draw1(mymap,index);
    await getFollowers(parent,res[0].owner.followers_url)
    await getImgTag(index, res[0].owner.avatar_url);
    parent.appendChild(await getAnchorTag(res[0].owner.html_url));
    const span=await createSpan();
    span.appendChild(document.createTextNode(`Total number of repositories ${res.length}`))
    parent.appendChild(span)
    getFollowing(parent,url);
}


function getRepo(name,index)
{
    var value=name.value;
    const xhr=new XMLHttpRequest();
    const url=`https://api.github.com/users/${value}/repos`
    xhr.open('GET',url)
    xhr.addEventListener("load",()=>{
        afterload(name,value,url,xhr.response,index)
    });
    xhr.send();
}  
