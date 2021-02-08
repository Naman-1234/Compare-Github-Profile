// const btn1=document.getElementById("reposbtn1");
// btn1.addEventListener("click",getRepos1)
// const btn2=document.getElementById("reposbtn2");
// btn2.addEventListener("click",getRepos2)
// function getRepos()
// {

// }
// async function afterload()
// {
//     if(this.status!=200)
//     {
//         swal({
//             title: "No Such Username Found",
//             text: "You clicked the button!",
//             icon: "warning",
//             button: "Try Again"
//           });
//     }
//     else
//     {
//         var res=await this.response
//         res=JSON.parse(res)
//         const imageURL=res[0].owner.avatar_url;
//         console.log('Image url is',imageURL)
//         swal({
//             title: "Are you sure?",
//             text: "Is this the image of the profile you are looking for",
//             icon:imageURL,
//             buttons: true,
//             dangerMode: true,
//           })
//           .then((show) => {
//             if (show) {
//               swal("Ok then", {
//                 icon: "success",
//               });
//               const imgTag=document.createElement('img');
//               imgTag.src=imageURL
//               imgTag.classList.add('img-thumbnail')
//               imgTag.classList.add('rounded')
//               imgTag.classList.add('img-fluid')
//               imgTag.classList.add('circularimage')
//               document.getElementsByClassName('firstInput')[0].prepend(imgTag)
//             } else {
//               swal("Try To fill value again");
//             }
//           }).catch((err)=>{
//               alert(err)
//           });
//     }
// }
// function getRepos1()
// {
//     const name=document.getElementById("input1").value;
//     console.log("Name is",name);
//     const xhr=new XMLHttpRequest();
//     const url=`https://api.github.com/users/${name}/repos`
//     xhr.open('GET',url)
//     console.log(xhr.status);
    
//     xhr.addEventListener("load",afterload);
//     xhr.send();
// }
// function getRepos2()
// {
//     const name=document.getElementById("input2").value;
//     console.log("Name is",name);
//     const xhr=new XMLHttpRequest();
//     const url=`https://api.github.com/users/${name}/repos`
//     xhr.open('GET',url)
//     console.log(xhr.status);
    
//     xhr.addEventListener("load",afterload);
//     xhr.send();
// }
// function submit()
// {

// }








const btn1=document.getElementById("reposbtn1");
btn1.addEventListener("click",getRepo)
function draw(mymap)
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
        title: 'Languages used by Me'
      };
      var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
    }
}

async function afterload()
{
    var res=this.response;
    res=JSON.parse(res);
    var mymap={}
    res.forEach(element => {
        if(element.fork!==true)
        {
            const xhr=new XMLHttpRequest();
            const name='Naman-1234'
            const reponame=element.name
            const url=`https://api.github.com/repos/${name}/${reponame}/languages`
            xhr.open('GET',url);
            xhr.onload=function()
            {
                var ans=xhr.response;
                ans=JSON.parse(ans)
                //console.log(ans)
                for(const key of Object.keys(ans))
                {
                    const ele=ans[key]
                    mymap[key]=(mymap[key]||0)+ele
                }
            }
            xhr.send()
        }
    });
    console.log(mymap)
    draw(mymap)
}
function getRepo()
{
    const name='Naman-1234';
    const xhr=new XMLHttpRequest();
    const url=`https://api.github.com/users/${name}/repos`
    xhr.open('GET',url)
    
    
    xhr.addEventListener("load",afterload);
    xhr.send();
}