
var unit = 50;
var skip = 100;
var baselineskip = 35;
var topskip = 15;
var fontspec = "30px Arial";

var timeouts = [];
var todolist = [4,9,1,12,10,7,11,3,2,8,5,13,6];

function clear(list,x,y,ctx) {
  ctx.clearRect(x*unit-3,y*skip-3,list.length*unit+6,unit+6);
}

function drawlist(list,color,x,y,ctx) {
  clear(list,x,y,ctx);
  var i;
  ctx.save();
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
  ctx.strokeStyle = truecolor;
  ctx.lineWidth = 3.0;
  ctx.fillStyle = truecolor;
  ctx.beginPath();
  for (i = 0; i < list.length; i++ ) {
    ctx.rect(x*unit+i*unit,y*skip,unit,unit);
    ctx.fillText(list[i].toString(),x*unit+i*unit+unit/2,y*skip+baselineskip);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function* mergesort(list0,x,y,ctx) {
  var ll, ll2, list1, list2, i, retlist1, retlist2, finallist;
  drawlist(list0,'G',x,y,ctx);
  if (list0.length == 1) {
    yield(1000);
    drawlist(list0,'B',x,y,ctx);
    yield(1000);
    return list0;
  }
  yield(1000);
  ll = list0.length;
  ll2 = Math.floor(ll/2);
  list1 = [];
  list2 = [];
  for (i = 0; i < ll; i++) {
    if (i < ll2) list1.push(list0[i]);
    else list2.push(list0[i]);
  }
  drawlist(list1,'W',x-0.5,y+1,ctx);
  drawlist(list2,'W',x+list1.length+0.5,y+1,ctx);
  yield(1000);
  retlist1 = yield* mergesort(list1,x-0.5,y+1,ctx);
  retlist2 = yield* mergesort(list2,x+list1.length+0.5,y+1,ctx);
  finallist = [];
  var i1=0, i2=0;
  while (i1 < retlist1.length || i2 < retlist2.length) {
    if (i1 < retlist1.length && (i2 >= retlist2.length || retlist1[i1] <= retlist2[i2])) {
      finallist.push(retlist1[i1]);
      i1 += 1;
    }
    else {
      finallist.push(retlist2[i2]);
      i2 += 1;
    }
  }
  drawlist(retlist1,'R',x-0.5,y+1,ctx);
  drawlist(retlist2,'R',x+list1.length+0.5,y+1,ctx);
  yield(1000);
  drawlist(finallist,'B',x,y,ctx);
  clear(retlist1,x-0.5,y+1,ctx);
  clear(retlist2,x+list1.length+0.5,y+1,ctx);
  yield(1000);
  return finallist;
}

function* startanim(ctx) {
  var list0 = todolist;
  var length0 = list0.length;
  var maxdepth = Math.ceil(Math.log(length0-0.1)/Math.log(2));
  yield* mergesort(list0,(ctx.canvas.width/2/unit)-length0/2,topskip/skip,ctx);
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
