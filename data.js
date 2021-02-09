

const btn1=document.getElementById("reposbtn1");
btn1.addEventListener("click",getRepo1)
function draw1(mymap)
{
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    async function drawChart() {
  
    const t2darr=await Object.keys(mymap).map((ele)=>{
        const arr=[ele,mymap[ele]]
        return arr
    }
    )
   
    const para=await t2darr.map((ele)=>{
        return ele
    })
    para.unshift(['Task',' Hours Per Day'])
    var data = google.visualization.arrayToDataTable(para);
    var options = {
        title: 'Languages used '
      };
      var chart = new google.visualization.PieChart(document.getElementById('piechart1'));

        chart.draw(data, options);
    }
  
}

async function getFollowers(url)
{
    const xhr=new XMLHttpRequest();
    xhr.open('GET',url)      
    var res=""
    xhr.onload=async function()
    {
        res=await xhr.response;
        res=JSON.parse(res)
        //* Bcoz we are only interested in finding number of followers and not their additional thing
        res=res.length
        document.getElementsByClassName('firstInput')[0].appendChild(document.createTextNode(`Total Number of followers=${res}`))
        document.getElementsByClassName('firstInput')[0].appendChild(document.createElement('br'))
    }
    xhr.send()
    
}
async function getFollowing(url)
{
    const xhr=new XMLHttpRequest();
    xhr.open('GET',url)      
    var res=""
    xhr.onload=async function()
    {
        res=await xhr.response;
        res=JSON.parse(res)
        //* Bcoz we are only interested in finding number of followers and not their additional thing
        res=res.length
        document.getElementsByClassName('firstInput')[0].appendChild(document.createTextNode(`Total Number of following=${res}`))
        
    }
    xhr.send()
}
async function afterload1()
{
    var res=this.response;
    res=JSON.parse(res);
    var mymap={}
    res.forEach(element => {
        //* In this what i have done is considered only those repos which is solo of his, Means do not contains any other contributor.
        if(element.fork!==true)
        {
            //* In this case we have to call to another url which will be language_url of that repo
            const xhr=new XMLHttpRequest();
            const name=document.getElementById('input1').value;
            const reponame=element.name
            const url=`https://api.github.com/repos/${name}/${reponame}/languages`
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
    await draw1(mymap)
    const firstdiv=document.getElementsByClassName('firstInput')[0];
    const src=res[0].owner.avatar_url;
    const imgTag=document.createElement('img')
    imgTag.src=src;
    imgTag.classList.add('img-fluid')
    imgTag.classList.add('img-responsive')
    imgTag.classList.add('circularimage')
    imgTag.classList.add('text-center')
    btn1.after(imgTag)
    const atag=document.createElement("A")
   atag.setAttribute('href',res[0].owner.html_url)
   atag.appendChild(document.createTextNode(' link to the Profile'))
    atag.title='Link'
    
    firstdiv.appendChild(atag)
    firstdiv.appendChild(document.createElement('br'))
    firstdiv.appendChild(document.createTextNode(`Number of Repositories =${res.length}`))
    firstdiv.appendChild(document.createElement('br'))
    
    const followers=await getFollowers(res[0].owner.followers_url)
    
    // const following=await getFollowing(res[0].owner.following_url)
}
   
function getRepo1()
{
    const name=document.getElementById('input1').value;
    const xhr=new XMLHttpRequest();
    const url=`https://api.github.com/users/${name}/repos`
    xhr.open('GET',url)
    xhr.addEventListener("load",afterload1);
    xhr.send();
}  