
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
  if (list.length == 0) {
    ctx.clearRect(x-5,y-3,10,unit+6);
  }
  else {
    ctx.clearRect(x-3,y-3,list.length*unit+6,unit+6);
  }
}

function clearpivot(x,y,ctx) {
  ctx.clearRect(x-3,y-3,unit+6,unit+6);
}

function drawpivot(a,color,x,y,ctx) {
  clearpivot(x,y,ctx);
  ctx.save();
  var truecolor = colors[color];
  ctx.strokeStyle = truecolor;
  ctx.lineWidth = 3.0;
  ctx.fillStyle = truecolor;
  ctx.beginPath();
  ctx.arc(x+unit/2,y+unit/2,unit/2,0,360);
  ctx.fillText(a.toString(),x+unit/2,y+baselineskip);
  ctx.stroke();
  ctx.restore();
}

function drawlist(list,color,x,y,ctx) {
  var truecolor = colors[color];
  clearlist(list,x,y,ctx);
  if (list.length == 0) {
    ctx.clearRect(x-3,y-3,6,unit+6);
    ctx.save();
    ctx.strokeStyle = truecolor;
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.rect(x-3,y,6,unit);
    ctx.stroke();
    ctx.restore();
  }
  else {
    var i;
    ctx.save();
    ctx.strokeStyle = truecolor;
    ctx.lineWidth = 3.0;
    ctx.fillStyle = truecolor;
    ctx.beginPath();
    for (i = 0; i < list.length; i++ ) {
      ctx.rect(x+i*unit,y,unit,unit);
      ctx.fillText(list[i].toString(),x+i*unit+unit/2,y+baselineskip);
    }
    ctx.stroke();
    ctx.restore();
  }
}

function* quicksort(list0,x,y,ctx) {
  var ll, list1, list2, i, retlist1, retlist2, finallist;
  drawlist(list0,'G',x,y,ctx);
  if (list0.length <= 1) {
    yield(1000);
    drawlist(list0,'B',x,y,ctx);
    yield(1000);
    return list0;
  }
  yield(1000);
  ll = list0.length;
  var pivot = list0[0];
  list1 = [];
  list2 = [];
  ctx.save();
  ctx.fillstyle = colors['Y'];
  ctx.clearRect(x+4,y+4,unit-8,unit-8);
  ctx.beginPath();
  ctx.arc(x+unit/2,y+unit/2,unit/2,0,360);
  ctx.stroke();
  ctx.fillText(list0[0].toString(),x+unit/2,y+baselineskip);
  yield(1000);
  ctx.font = fontspecitalic;
  ctx.fillstyle = colors['G'];
  for (i = 1; i < ll; i++) {
    if (list0[i] <= pivot) {
      list1.push(list0[i]);
      ctx.clearRect(x+i*unit+4,y+4,unit-8,unit-8);
      ctx.fillText(list0[i].toString(),x+i*unit+unit/2,y+baselineskip);
    }
    else list2.push(list0[i]);
  }
  ctx.stroke();
  ctx.restore();
  yield(1000);
  var xp,x1,x2;
  xp = x+(list0.length-1)/2*unit;
  x1 = xp-unit/2-list1.length*unit;
  x2 = xp+1.5*unit;
  drawlist(list1,'W',x1,y+skip,ctx);
  drawlist(list2,'W',x2,y+skip,ctx);
  drawpivot(pivot,'Y',xp,y+skip,ctx);
  yield(1000);
  retlist1 = yield* quicksort(list1,x1,y+skip,ctx);
  retlist2 = yield* quicksort(list2,x2,y+skip,ctx);
  finallist = [];
  for (i = 0; i < retlist1.length; i++) {
    finallist.push(retlist1[i]);
  }
  finallist.push(pivot);
  for (i = 0; i < retlist2.length; i++) {
    finallist.push(retlist2[i]);
  }
  drawlist(retlist1,'R',x1,y+skip,ctx);
  drawpivot(pivot,'R',xp,y+skip,ctx);
  drawlist(retlist2,'R',x2,y+skip,ctx);
  yield(1000);
  drawlist(finallist,'B',x,y,ctx);
  clearlist(retlist1,x1,y+skip,ctx);
  clearpivot(xp,y+skip,ctx);
  clearlist(retlist2,x2,y+skip,ctx);
  yield(1000);
  return finallist;
}

function* startanim(ctx) {
  var list0 = todolist;
  var length0 = list0.length;
  var maxdepth = Math.ceil(Math.log(length0-0.1)/Math.log(2));
  var x = ctx.canvas.width/2;
  var y = topskip;
  x = x-(length0)/2*unit;
  yield* quicksort(list0,x,y,ctx);
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
