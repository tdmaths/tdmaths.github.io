
var unit = 50;
var skip = 100;
var baselineskip = 35;
var topskip = 15;
var fontspec = "30px Arial";

var timeouts = [];
var todolist1 = [];
var todolist2 = []

function drawlist(list,k,index,x,y,ctx) {
  var i;
  ctx.save();
  truecolor = '#A0A0A0';
  ctx.strokeStyle = truecolor;
  ctx.lineWidth = 3.0;
  ctx.fillStyle = truecolor;
  ctx.beginPath();
  for (i = 0; i < k; i++ ) {
    ctx.rect(x*unit+i*unit,y*skip,unit,unit);
    ctx.fillText(list[i].toString(),x*unit+i*unit+unit/2,y*skip+baselineskip);
  }
  ctx.closePath();
  ctx.stroke();
  truecolor = '#FF0000';
  ctx.strokeStyle = truecolor;
  ctx.lineWidth = 3.0;
  ctx.fillStyle = truecolor;
  ctx.beginPath();
  for (i = k; i < list.length; i++ ) {
    ctx.rect(x*unit+i*unit,y*skip,unit,unit);
    ctx.fillText(list[i].toString(),x*unit+i*unit+unit/2,y*skip+baselineskip);
  }
  ctx.moveTo((x+k)*unit+2*unit/5,y*skip+unit);
  ctx.lineTo((x+k)*unit+2*unit/5,y*skip+unit+unit/2);
  ctx.closePath();
  ctx.stroke();
  ctx.textBaseline="hanging";
  ctx.fillText(index,(x+k)*unit+2*unit/5,y*skip+unit+unit/2+baselineskip/5);
  ctx.restore();
}

function drawlist0(list0,x,y,ctx) {
  var i;
  ctx.save();
  truecolor = '#0000FF';
  ctx.strokeStyle = truecolor;
  ctx.lineWidth = 3.0;
  ctx.fillStyle = truecolor;
  ctx.beginPath();
  for (i = 0; i < list0.length; i++ ) {
    ctx.rect(x*unit+i*unit,y*skip,unit,unit);
    ctx.fillText(list0[i].toString(),x*unit+i*unit+unit/2,y*skip+baselineskip);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function* merge(list1,list2,x0,x1,x2,y,ctx) {
  var i0=0,i1=0,i2=0;
  list0 = [];
  
  while (i1 < list1.length || i2 < list2.length) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawlist(list1,i1,"i1",x1,y+1,ctx);
    drawlist(list2,i2,"i2",x2,y+1,ctx);
    drawlist0(list0,x0,y,ctx);
    yield(1000);
    if (i1 < list1.length && (i2 >= list2.length || list1[i1] <= list2[i2])) {
      list0.push(list1[i1]);
      i1 += 1;
    }
    else {
      list0.push(list2[i2]);
      i2 += 1;
    }
  }
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawlist(list1,i1,"i1",x1,y+1,ctx);
  drawlist(list2,i2,"i2",x2,y+1,ctx);
  drawlist0(list0,x0,y,ctx);
  yield(1500);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawlist0(list0,x0,y,ctx);
}

function* startanim(ctx) {
  var list1 = todolist1;
  var list2 = todolist2;
  length = list1.length + list2.length;
  x0 = (ctx.canvas.width/2/unit);
  x0 = x0 - (list1.length+list2.length)/2;
  x1 = x0 - 0.5;
  x2 = x1 + list1.length + 1;
  yield* merge(list1,list2,x0,x1,x2,topskip/skip,ctx);
}

function drawdata(gen) {
  var r = gen.next();
  if (r.done) {
    return;
  }
  var timer = r.value/1000;
  var timeunit = slider.value;
  timeunit = 3051-51.643*timeunit+0.2123*timeunit**2;
  timeouts.push(setTimeout(function(){drawdata(gen);},timer*timeunit));
}

function doit() {
  var canvas = document.getElementById('canvas');
  slider = document.getElementById('speed');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.font = fontspec;
    ctx.textAlign = "center"
    for (var i=0; i<timeouts.length; i++) {
      clearTimeout(timeouts[i]);
    }
    timeouts = [];
    ctx.clearRect(0,0,canvas.width,canvas.height);
    todolist1 = document.getElementById('list1').value.split(' ');
    todolist1 = todolist1.map(function(s){return parseInt(s,10);});
    todolist2 = document.getElementById('list2').value.split(' ');
    todolist2 = todolist2.map(function(s){return parseInt(s,10);});
    drawdata(startanim(ctx));
  }
}

function setlist() {
  document.getElementById('list1').value = "1 5 6 7 9 10";
  document.getElementById('list2').value = "2 3 4 8 11 12 13";
}

var slider = document.getElementById('speed');
