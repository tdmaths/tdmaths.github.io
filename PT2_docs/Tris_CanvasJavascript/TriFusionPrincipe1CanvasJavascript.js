
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
// Exact values of x's and y's.
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

function drawtext(text,x,y,ctx) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillText(text,x,y);
  ctx.restore();
}

function drawrepart(list1,list2,italic,color,x,y,ctx) {
  //italic 0 : no italic
  //italic 1 : list1 in italic
  //italic 2 : list2 in italic
  var list3, i, x0, istart, iend;
  list3 = list1.concat(list2);
  drawlist(list3,color,x,y,ctx);
  //italic
  if (italic != 0) {
    if (italic == 1) {
      istart = 0;
      iend = istart + list1.length;
    }
    else {
      istart = list1.length;
      iend = istart + list2.length;
    }
  }
  // cut
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x+list1.length*unit,y-2);
  ctx.lineTo(x+list1.length*unit,y+unit+2);
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.font = fontspecitalic;
  for (i = istart; i<iend; i++) {
    ctx.clearRect(x+i*unit+4,y+4,unit-8,unit-8);
    ctx.fillText(list3[i].toString(),x+i*unit+unit/2,y+baselineskip);
  }
  ctx.restore();
}

function* mergesort(list0,x,y,x0,y0,ctx) {
  var ll, list1, list2, i, retlist1, retlist2, finallist;
  drawlist(list0,'G',x,y,ctx);
  yield(1000);
  cut = Math.floor(list0.length/2);
  list1 = list0.slice(0,cut);
  list2 = list0.slice(cut);
  drawrepart(list1,list2,1,'G',x,y,ctx);
  yield(1000);
  drawtext('trier à gauche',x0,y0,ctx);
  yield(1000);
  list1 = list1.sort((x,y)=>x>y?1:x<y?-1:0);
  drawrepart(list1,list2,1,'G',x,y,ctx);
  yield(1000);
  drawrepart(list1,list2,2,'G',x,y,ctx);
  yield(1000);
  drawtext('trier à droite',x0,y0+unit,ctx);
  yield(1000);
  list2 = list2.sort((x,y)=>x>y?1:x<y?-1:0);
  drawrepart(list1,list2,2,'G',x,y,ctx);
  yield(1000);
  drawrepart(list1,list2,0,'G',x,y,ctx);
  yield(1000);
  drawrepart(list1,list2,0,'R',x,y,ctx);
  drawtext('fusionner',x0,y0+2*unit,ctx);
  yield(1000);
  list3 = list0.sort((x,y)=>x>y?1:x<y?-1:0);
  drawlist(list3,'B',x,y,ctx);
  return finallist;
}

function* startanim(ctx) {
  var list0 = todolist;
  var length0 = list0.length;
  var maxdepth = Math.ceil(Math.log(length0-0.1)/Math.log(2));
  var x = ctx.canvas.width/2;
  var x0 = 100;
  var y0 = 5*unit;
  var y = topskip;
  x = x-(length0)/2*unit;
  yield* mergesort(list0,x,y,x0,y0,ctx);
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
