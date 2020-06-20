
var unit = 50;
var skip = 100;
var baselineskip = 35;
var topskip = 15;
var fontspec = "30px Arial";
var fontspecitalic = "italic 30px Arial";

var timeouts = [];
var todolist = [4,9,1,12,10,7,11,3,2,8,5,13,6];

var colors = {
  'R':'#ff0000',
  'W':'#a0a0a0', 
  'B':'#0000ff',
  'G':'#00ff00',
  'Y':'#d7c32a'
};
// Starting from this I decided to put exact values
// of x's and y's.
// Those indicate the upper left corner
// of the bounding rectangular box.

function clearlist(list,x,y,ctx) {
  ctx.clearRect(x-3,y-3,list.length*unit+6,3*unit+6);
}

function drawlist1(list,j,nj,k,nk,x,y,ctx) {
  var i,truecolor;
  
  clearlist(list,x,y,ctx);
  for (i=list.length-1; i>=0; --i) {
    //console.log('ii');
    //console.log(i);
    if (i<j) {
      truecolor = colors['G'];
    }
    else if (i<k) {
      truecolor = colors['B'];
    }
    else {
      truecolor = colors['W'];
    }
    ctx.save();
    ctx.strokeStyle = truecolor;
    ctx.lineWidth = 3.0;
    ctx.fillStyle = truecolor;
    ctx.beginPath();
    ctx.rect(x+i*unit,y,unit,unit);
    ctx.fillText(list[i].toString(),x+i*unit+unit/2,y+baselineskip);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
  ctx.save();
  ctx.textBaseline="hanging";
  ctx.strokeStyle = colors['G'];
  ctx.fillStyle = colors['G'];
  ctx.beginPath();
  ctx.moveTo(x+j*unit+2*unit/5,y+unit);
  ctx.lineTo(x+j*unit+2*unit/5,y+unit+unit/2);
  ctx.stroke();
  ctx.fillText(nj,x+j*unit+2*unit/5,y+unit+unit/2+baselineskip/5);
  ctx.strokeStyle = colors['B'];
  ctx.fillStyle = colors['B'];
  ctx.beginPath();
  ctx.moveTo(x+k*unit+2*unit/5,y+unit);
  ctx.lineTo(x+k*unit+2*unit/5,y+unit+unit/2);
  ctx.stroke();
  ctx.fillText(nk,x+k*unit+2*unit/5,y+unit+unit/2+baselineskip/5);
  ctx.restore();
}  

function drawpivot(color,x,y,ctx) {
  ctx.save();
  var truecolor = colors[color];
  ctx.strokeStyle = truecolor;
  ctx.lineWidth = 3.0;
  ctx.fillStyle = truecolor;
  ctx.beginPath();
  ctx.arc(x+unit/2,y+unit/2,unit/2,0,360);
  ctx.stroke();
  ctx.restore();
}

function* repartition(list0,x,y,ctx) {
  var ll, list1, list2, i, retlist1, retlist2, finallist;
  var j,k, pivot;
  list1 = list0.slice();
  j=1; k=1;
  pivot = list0[0];
  //1->j taken into account lower or equal than pivot
  //j->k taken into account higher than pivot
  //k->  not taken into account yet
  while (k<list1.length) {
    console.log(list1);
    drawlist1(list1,j,"j",k,"k",x,y,ctx);
    drawpivot('Y',x,y,ctx);
    yield(1000);
    if (list1[k] <= pivot) {
      var tmp = list1[k];
      list1[k] = list1[j];
      list1[j] = tmp;
      j += 1;
    }
    k += 1;
  }
  drawlist1(list1,j,"j",k,"k",x,y,ctx);
  drawpivot('Y',x,y,ctx);
  yield(1000);
  tmp = list1[j-1];
  list1[j-1] = list1[0];
  list1[0] = tmp;
  drawlist1(list1,j,"j",k,"k",x,y,ctx);
  drawpivot('Y',x+(j-1)*unit,y,ctx);
  yield(1000);
}

function* startanim(ctx) {
  var list0 = todolist;
  var length0 = list0.length;
  var maxdepth = Math.ceil(Math.log(length0-0.1)/Math.log(2));
  var x = ctx.canvas.width/2;
  var y = topskip;
  x = x-(length0)/2*unit;
  yield* repartition(list0,x,y,ctx);
}

var curgen;
var animstate;
// 0 : running
// 1 : paused
// 2 : finished ??

function drawdata() {
  var r = curgen.next();
  if (r.done) {
    document.getElementById('pause').disabled = true;
    document.getElementById('step').disabled = true;
    return;
  }
  if (animstate == 0) {
    var timer = r.value/1000;
    var timeunit = slider.value;
    var timeunit = 3051-51.643*timeunit+0.2123*timeunit**2;
    timeouts.push(setTimeout(drawdata,timer*timeunit));
  }
}

function cleartimeouts() {
  for (var i=0; i<timeouts.length; ++i) {
    clearTimeout(timeouts[i]);
  }
  timeouts = [];
}

function pause() {
  if (animstate == 0) {
    document.getElementById('step').disabled = false;
    document.getElementById('pause').textContent = 'Continue';
    cleartimeouts();
    animstate = 1;
  }
  else {
    document.getElementById('step').disabled = true;
    document.getElementById('pause').textContent = 'Pause';
    animstate = 0;
    drawdata();
  }
}

function step() {
  drawdata();
}

function doit() {
  var canvas = document.getElementById('canvas');
  slider = document.getElementById('speed');
  if (canvas.getContext) {
    cleartimeouts();
    var ctx = canvas.getContext('2d');
    ctx.font = fontspec;
    ctx.textAlign = "center"
    ctx.clearRect(0,0,canvas.width,canvas.height);
    todolist = document.getElementById('list').value.split(' ');
    document.getElementById('pause').disabled = false;
    document.getElementById('step').disabled = true;
    console.log(todolist);
    todolist = todolist.map(function(s){return parseInt(s,10);});
    console.log(todolist);
    curgen = startanim(ctx);
    animstate = 0;
    drawdata();
  }
}

function setlist() {
  document.getElementById('list').value = "4 9 1 12 10 7 11 3 2 8 5 13 6";
}

var slider = document.getElementById('speed');
