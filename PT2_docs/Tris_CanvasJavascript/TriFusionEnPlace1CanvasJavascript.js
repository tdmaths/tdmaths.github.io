
var unit = 50;
var skip = 100;
var braceskip = 10;
var bracepadding = 3;
var braceheight = 3;
var bracelinewidth = 2;
var baselineskip = 35;
var topskip = 15;
var fontspec = "30px Arial";

var timeouts = [];
var todolist = [4,9,1,12,10,7,11,3,2,8,5,13,6];

function clearbrace(a,b,x,y,depth,ctx) {
  // x,y are the coordinates of the upper left
  // corner of the list
  var pt1x = (x+a)*unit;
  var pt1y = y*skip-(depth+1)*(braceskip+braceheight);
  // top right corner, ignoring padding
  var pt2x = (x+b)*unit;
  ctx.clearRect(pt1x+bracepadding-(bracelinewidth+1)/2,pt1y-(bracelinewidth+1)/2,(b-a)*unit-2*bracepadding+bracelinewidth+1,braceheight+bracelinewidth+1);
}

function drawbrace(a,b,color,x,y,depth,ctx) {
  // x,y are the coordinates of the upper left
  // corner of the list
  clearbrace(a,b,x,y,depth,ctx);
  // top left corner, ignoring padding
  var pt1x = (x+a)*unit;
  var pt1y = y*skip-(depth+1)*(braceskip+braceheight);
  // top right corner, ignoring padding
  var pt2x = (x+b)*unit;
  var truecolor;
  switch (color) {
  case 'W':
    truecolor = '#A0A0A0';
    break;
  case 'B':
    truecolor = '#0000FF';
    break;
  case 'R':
    truecolor = '#FF0000';
    break;
  case 'G':
    truecolor = '#00FF00';
    break;
  }
  ctx.save();
  ctx.strokeStyle = truecolor;
  ctx.lineWidth = bracelinewidth;
  ctx.beginPath();
  ctx.moveTo(pt1x+bracepadding,pt1y+braceheight);
  ctx.lineTo(pt1x+bracepadding,pt1y);
  ctx.lineTo(pt2x-bracepadding,pt1y);
  ctx.lineTo(pt2x-bracepadding,pt1y+braceheight);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function clearlist(list,x,y,ctx) {
  ctx.clearRect(x*unit-3,y*skip-3,list.length*unit+6,unit+6);
}

function drawlist(list,x,y,ctx) {
  clearlist(list,x,y,ctx);
  var i;
  ctx.save();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3.0;
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  for (i = 0; i < list.length; i++ ) {
    ctx.rect(x*unit+i*unit,y*skip,unit,unit);
    if (list[i] != '') {
      ctx.fillText(list[i].toString(),x*unit+i*unit+unit/2,y*skip+baselineskip);
    }
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function* mergesort1(list0,T,x,y,depth,a,b,ctx) {
  drawlist(list0,x,y,ctx);
  drawlist(T,x,y+1,ctx);
  drawbrace(a,b,'G',x,y,depth,ctx);
  yield(1000);
  if ((b-a) <= 1) {
    drawbrace(a,b,'B',x,y,depth,ctx);
    yield(1000);
    return;
  }
  var m = Math.floor((a+b)/2);
  drawbrace(a,m,'W',x,y,depth+1,ctx);
  drawbrace(m,b,'W',x,y,depth+1,ctx);
  yield(1000);
  yield* mergesort1(list0,T,x,y,depth+1,a,m,ctx);
  //yield(1000);
  yield* mergesort1(list0,T,x,y,depth+1,m,b,ctx);
  var i,i1,i2;
  for (i=a; i<m; i++) {
    T[i] = list0[i];
    list0[i] = '';
  }
  drawbrace(a,m,'R',x,y,depth+1,ctx);
  drawlist(list0,x,y,ctx);
  drawlist(T,x,y+1,ctx);
  yield(1000);
  for (i=m; i<b; i++) {
    T[i] = list0[i];
    list0[i] = '';
  }
  drawbrace(m,b,'R',x,y,depth+1,ctx);
  drawlist(list0,x,y,ctx);
  drawlist(T,x,y+1,ctx);
  yield(1000);
  i = a;
  i1 = a;
  i2 = m;
  while (i<b) {
    if (i1 < m && (i2 >= b || T[i1] <= T[i2])) {
      list0[i] = T[i1];
      T[i1] = '';
      i1 += 1;
    }
    else {
      list0[i] = T[i2];
      T[i2] = '';
      i2 += 1;
    }
    i += 1;
    drawlist(list0,x,y,ctx);
    drawlist(T,x,y+1,ctx);
    yield(500);
  }
  drawlist(list0,x,y,ctx);
  clearbrace(m,b,x,y,depth+1,ctx);
  clearbrace(a,m,x,y,depth+1,ctx);
  drawbrace(a,b,'B',x,y,depth,ctx);
  yield(1000);
  return;
}

function* startanim(ctx) {
  var list0 = todolist;
  var T = [];
  var length0 = list0.length;
  for (var i=0; i<length0; i++) {
    T.push('');
  }
  var maxdepth = Math.ceil(Math.log(length0-0.1)/Math.log(2));
  var x = (ctx.canvas.width/2/unit)-length0/2;
  var y = (topskip+(maxdepth+1)*(braceskip+braceheight))/skip;
  yield* mergesort1(list0,T,x,y,0,0,length0,ctx);
  clearbrace(0,length0,x,y,0,ctx);
}

function drawdata(gen) {
  var r = gen.next();
  if (r.done) {
    return;
  }
  var timer = r.value/1000;
  var timeunit = slider.value;
  var timeunit = 3051-51.643*timeunit+0.2123*timeunit**2;
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
    todolist = document.getElementById('list').value.split(' ');
    console.log(todolist);
    todolist = todolist.map(function(s){return parseInt(s,10);});
    console.log(todolist);
    drawdata(startanim(ctx));
  }
}

function setlist() {
  document.getElementById('list').value = "4 9 1 12 10 7 11 3 2 8 5 13 6";
}

var slider = document.getElementById('speed');
