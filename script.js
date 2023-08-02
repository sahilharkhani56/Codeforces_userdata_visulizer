
const weekProblems = {};
const yearProblems = {};
const monthProblem = {};
var ratingChartLabel_week = [];
var ratingChartData_week = [];
var ratingChartLabelm_week = [];
var ratingChartDatam_week = [];
var ratingChartLabel_year = [];
var ratingChartData_year = [];
var ratingChartLabelm_year = [];
var ratingChartDatam_year = [];
var rangeY=0;
var rangeW=0;
var userRating;
async function data(event) {
  event.preventDefault()
  const chartWeek=document.getElementById('weekChart')
  chartWeek.value=''
  const username = document.getElementById("username").value;
  await problems(username);
}
async function problems(username) {
  const response = await fetch(
    `https://codeforces.com/api/user.status?handle=${username}&from=1&count=1000000`
  );
  const data = await response.json();
  const result = data.result;
  const rating = await fetch(
    `https://codeforces.com/api/user.rating?handle=${username}`
  );
  const rat = await rating.json();
  userRating=rat.result[rat.result.length-1].newRating;
  if (data.status === "OK") {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var monthsDays=[31,28,31,30,31,30,31,31,30,31,30,31]
    var days=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const oa = new Date();
    var oyear = oa.getFullYear();
    var omonth = months[oa.getMonth()];
    var odate = oa.getDate();
    let oday =days[oa.getDay()]
    var dayIndex=oa.getDay(),dayIndex2=0;
    dayIndex2=dayIndex;
    var monthIndex=oa.getMonth(),monthIndex2=monthIndex;
    for(var i=0;i<7;i++){
        weekProblems[days[i]]=0;
    }
    for(var i=0;i<=monthIndex;i++){
        yearProblems[months[i]+` ${oyear}`]=0;
    }
    for(var i=monthIndex+1;i<12;i++){
        yearProblems[months[i]+` ${oyear-1}`]=0;
    }
    dayIndex=dayIndex2;
    var flag=1,flag1=1,flag2=1;
    for (var i = 0; i < result.length; i++) {
      if (result[i].verdict === "OK") {
        let unix_timestamp = result[i].creationTimeSeconds;
        var a = new Date(unix_timestamp * 1000);
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        let day =days[a.getDay()]
        if(odate>6 && (odate-6<=date) && flag ){weekProblems[day]+=1;}
        else if(odate<7 && (monthsDays[(monthIndex+12-1) % 12]-7+odate<date && a.getMonth()===oa.getMonth()-1) &&flag){weekProblems[day]+=1;}
        else if(odate<7 && (a.getMonth()===oa.getMonth()) && flag){weekProblems[day]+=1;}
        else{
            flag=0;
        }
        if(year===oyear && a.getMonth()<=oa.getMonth() && flag1){
            yearProblems[month+` ${year}`]+=1;
        }
        else{
            flag1=0;
        }
        if(year===oyear-1 && oa.getMonth()<a.getMonth() ){
            yearProblems[month+` ${year}`]+=1;
        }
        else{
            flag2=0;
        }
      }
    }
    for(var i=0;i<7;i++){
        dayIndex--;
        if(dayIndex===-1)dayIndex=6;
    }
    console.log(weekProblems);
        ratingChartLabel_week.push(Object.keys(weekProblems));
        ratingChartData_week.push(Object.values(weekProblems));
        ratingChartLabel_year.push(Object.keys(yearProblems));
        ratingChartData_year.push(Object.values(yearProblems));
        for (var i=0;i<7;i++){
            ratingChartDatam_week.push(ratingChartData_week[0][dayIndex])
            ratingChartLabelm_week.push(ratingChartLabel_week[0][dayIndex])
            dayIndex--;
            if(dayIndex<0)dayIndex=6;
        }
        for(var i=monthIndex+1;i<12;i++){
            ratingChartDatam_year.push(ratingChartData_year[0][i])
            ratingChartLabelm_year.push(ratingChartLabel_year[0][i])
        }
        for(var i=0;i<=monthIndex;i++){
            ratingChartDatam_year.push(ratingChartData_year[0][i])
            ratingChartLabelm_year.push(ratingChartLabel_year[0][i])
        }
        rangeY=Math.max(...ratingChartDatam_year)
    createProblemRatingChart_week()
    createProblemRatingChart_year()
  } else {
    const err = document.getElementById("status");
    err.innerHTML = "invalid username";
    err.style.color = "red";
    err.style.fontSize = "20px";
  }
}

 function createProblemRatingChart_week(){
    new Chart("weekChart", {
        type: "bar",
        data: {
          labels: ratingChartLabelm_week.reverse(),
          datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor:ratingBackgroundColor(userRating),
            borderColor: "rgba(0,0,255,0.1)",
            data: ratingChartDatam_week.reverse()
          }]
        },
        options: {
          legend: {display: false},
          scales: {
            yAxes:{ beginAtZero: true},
          }
        }
      });
}
function createProblemRatingChart_year(){
    new Chart("yearChart", {
        type: "bar",
        data: {
          labels: ratingChartLabelm_year,
          datasets: [{
            label: 'Overhead',
            fill: false,
            lineTension: 0,
            backgroundColor: ratingBackgroundColor(userRating),
            borderColor: "rgba(0,0,255,0.1)",
            data: ratingChartDatam_year
          }]
        },
        options: {
          legend: {display: false},
          scales: {
            yAxes:{ beginAtZero: true},
          }
        }
      });
}
function ratingBackgroundColor(rating){
    const legendaryGrandmaster      = 'rgba(170,0  ,0  ,0.9)';
    const internationalGrandmaster  = 'rgba(255,51 ,51 ,0.9)';
    const grandmaster               = 'rgba(255,119,119,0.9)';
    const internationalMaster       = 'rgba(255,187,85 ,0.9)';
    const master                    = 'rgba(255,204,136,0.9)';
    const candidateMaster           = 'rgba(255,136,255,0.9)';
    const expert                    = 'rgba(170,170,255,0.9)';
    const specialist                = 'rgba(119,221,187,0.9)';
    const pupil                     = 'rgba(119,255,119,0.9)';
    const newbie                    = 'rgba(204,204,204,0.9)';
    if(rating>=3000){
      return legendaryGrandmaster;
    }else if(rating>=2600 && rating<=2999){
      return internationalGrandmaster;
    }else if(rating>=2400 && rating<=2599){
      return grandmaster;
    }else if(rating>=2300 && rating<=2399){
      return internationalMaster;
    }else if(rating>=2100 && rating<=2299){
      return master;
    }else if(rating>=1900 && rating<=2099){
      return candidateMaster;
    }else if(rating>=1600 && rating<=1899){
      return expert;
    }else if(rating>=1400 && rating<=1599){
      return specialist;
    }else if(rating>=1200 && rating<=1399){
      return pupil;
    }else{
      return newbie;
    }
  }