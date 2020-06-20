
var unit = 50;
var skip = 100;
var baselineskip = 35;
var topskip = 15;
var fontspec = "30px Arial";

var timeouts = [];
var todolist1 = [];
var todolist2 = []

function drawlist(list,k,indexk,j,indexj,x,y,ctx) {
  var i, truecolor;
  //ctx.save();
// inférieurs au pivot
  truecolor = '#A0A0A0';
  ctx.save();
  ctx.strokeStyle = truecolor;
  ctx.lineWidth = 3.0;
  ctx.fillStyle = truecolor;
  ctx.beginPath();
  for (i = 0; i < k; i++ ) {
    ctx.rect(x*unit+i*unit,y*skip,unit,unit);
    ctx.fillText(list[i].toString(),x*unit+i*unit+unit/2,y*skip+baselineskip);
  }
  ctx.stroke();
// supérieurs au pivot

  truecolor = '#FF0000';
  ctx.strokeStyle = truecolor;
  ctx.lineWidth = 3.0;
  ctx.fillStyle = truecolor;
  ctx.beginPath();
  for (i = k; i < j; i++ ) {
    ctx.rect(x*unit+i*unit,y*skip,unit,unit);
    ctx.fillText(list[i].toString(),x*unit+i*unit+unit/2,y*skip+baselineskip);
  }
  ctx.moveTo((x+k)*unit+2*unit/5,y*skip+unit);
  ctx.lineTo((x+k)*unit+2*unit/5,y*skip+unit+unit/2);
  ctx.closePath();
  ctx.stroke();
  ctx.fillText(indexk,(x+k)*unit+2*unit/5,y*skip+2*unit+baselineskip/5);

  // à traiter
  truecolor = '#A030A0';
  ctx.strokeStyle = truecolor;
  ctx.lineWidth = 3.0;
  ctx.fillStyle = truecolor;
  ctx.beginPath();
  for (i = j; i < list.length; i++ ) {
    ctx.rect(x*unit+i*unit,y*skip,unit,unit);
    ctx.fillText(list[i].toString(),x*unit+i*unit+unit/2,y*skip+baselineskip);
  }
  ctx.moveTo((x+j)*unit+2*unit/5,y*skip+unit);
  ctx.lineTo((x+j)*unit+2*unit/5,y*skip+unit+unit/2);
  ctx.stroke();
// indices en dessous
  //ctx.textBaseline="hanging";
  ctx.fillText(indexj,(x+j)*unit+2*unit/5,y*skip+2*unit+baselineskip/5);
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
  ctx.stroke();
  ctx.restore();
}


function drawpivot(a,x,y,ctx) {
  //clearpivot(x,y,ctx);
  ctx.save();
  var truecolor = '#400040';
  ctx.strokeStyle = truecolor;
  ctx.lineWidth = 5.0;
  ctx.fillStyle = truecolor;
  ctx.beginPath();
  ctx.arc(x*unit+unit/2,y*skip+unit/2,unit/2,0,360);
  //ctx.fillText(a.toString(),x+unit/2,y+baselineskip);
  ctx.stroke();
  ctx.restore();
}

function* partition(list1,x0,x1,x2,y,ctx) {
  var pivot=list1[0],i=1,j=1,u=0;
  list0 = [];
  list0.push(list1[0])
  while (j < list1.length ) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawlist(list1,i,"i",j,"j",x0,y+1,ctx);
    drawpivot(pivot,x0,y+1,ctx);
    yield(1000);
    list0.push(list1[j]);

    if (list1[j]<= pivot){
        u = list1[j]
        list1[j] = list1[i]
        list1[i] = u
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawlist(list1,i,"i",j,"j",x0,y+1,ctx);
        drawpivot(pivot,x0,y+1,ctx);
        yield(1000);
        i += 1
    }
    j += 1
  }
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawlist(list1,i,"i",j,"j",x0,y+1,ctx);
  drawpivot(pivot,x0,y+1,ctx);
  drawlist0(list0,x0,y,ctx);
  yield(1500);
    // on échange le pivot et l'élément à la position i-1
  list1[0] = list1[i-1]
  list1[i-1] = pivot
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawlist(list1,i,"i",j,"j",x0,y+1,ctx);
  drawpivot(pivot,x0+i-1,y+1,ctx);
  drawlist0(list0,x0,y,ctx);
  
  //ctx.clearRect(0,0,canvas.width,canvas.height);
  //drawlist0(list0,x0,y,ctx);
}

function* startanim(ctx) {
  var list1 = todolist1;
  length = list1.length ;
  x0 = (ctx.canvas.width/2/unit);
  x0 = x0 - (list1.length)/2;
  x1 = x0 - 0.5;
  x2 = x1 + list1.length + 1;
  ctx.textBaseline="alphabetic";
  yield* partition(list1,x0,x1,x2,topskip/skip,ctx);
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
    drawdata(startanim(ctx));
  }
}

function setlist() {
  document.getElementById('list1').value = "6 4 10 9 6 15 12 3 8 7 4 6 1 9 10";

}

var slider = document.getElementById('speed');
