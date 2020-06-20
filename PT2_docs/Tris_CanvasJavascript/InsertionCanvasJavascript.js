
var unit = 50;
var skip = 100;
var baselineskip = 35;
var topskip = 15;
var fontspec = "30px Arial";

var timeouts = [];
var todolist1 = [];
var todolist2 = []

function drawlist(list,j,k,indexj,indexk,x,y,ctx) {
  var i;
  ctx.save();
  // dessine la liste en gris
  truecolor = '#A0A0A0';
  ctx.strokeStyle = truecolor;
  ctx.lineWidth = 3.0;
  ctx.fillStyle = truecolor;
  ctx.beginPath();
  for (i = 0; i < j; i++ ) {
    ctx.rect(x*unit+i*unit,y*skip,unit,unit);
    ctx.fillText(list[i].toString(),x*unit+i*unit+unit/2,y*skip+baselineskip);
  }
  ctx.closePath();
  ctx.stroke();
  // on recommence avec la liste en rouge 
  truecolor = '#FF0000';
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
  ctx.closePath();
  ctx.stroke();
  ctx.textBaseline="hanging";
  ctx.fillText(indexj,(x+j)*unit+2*unit/5,y*skip+unit+unit/2+baselineskip/5);
  // dessine la case correspondant à l'indice k
  // si indexk != ""
  if (indexk != "") {
    truecolor = '#00FF00';
    ctx.strokeStyle = truecolor;
    ctx.lineWidth = 3.0;
    ctx.fillStyle = truecolor;
    ctx.beginPath();
    ctx.rect(x*unit+k*unit,y*skip,unit,unit);
    ctx.moveTo((x+k)*unit+2*unit/5,y*skip+unit);
    ctx.lineTo((x+k)*unit+2*unit/5,y*skip+unit+unit/2);
    ctx.closePath();
    ctx.stroke();
    ctx.textBaseline="hanging";
    if ( k == j) {
        ctx.fillText(indexk,(x+k)*unit+2*unit/5,y*skip+2*unit+baselineskip/5);
    } else {
        ctx.fillText(indexk,(x+k)*unit+2*unit/5,y*skip+unit+unit/2+baselineskip/5);
    }
    }
  
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


function* insere(list,u,x0,x1,x2,y,ctx) {
  var i0=0,i1=0,i2=0;
  var k =0;
  var listu = [u];
    /*L.append(u)        # L[n] = u
    k = n              # L a n+1 éléments
    while k>0 and L[k-1]>u : 
        L[k] = L[k-1]  # on décale les éléments
        k = k-1
    L[k]=u # on insère u */
  k = list.length - 1 // dernier élément
  while (k >0 && list[k-1]>u) {
    list[k] = list[k-1]
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawlist(list,k,0,"k","",x1,y+1,ctx);
    // drawtext("debug",x0,y,ctx);
    drawlist0(listu,x1+k,y,ctx);
    yield(1000);
    k = k -1
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawlist(list,k,k,"k","",x1,y+1,ctx);
    // drawtext("debug",x0,y,ctx);
    drawlist0(listu,x1+k,y,ctx);
    yield(1000);

    }
  list[k] = u
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawlist(list,k,k,"k","",x1,y+1,ctx);
  yield(1500);
  //ctx.clearRect(0,0,canvas.width,canvas.height);
  //drawlist0(list0,x0,y,ctx);
}

function drawtext(text,x,y,ctx) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillText(text,x,y);
  ctx.restore();
}

function* startanim(ctx) {
    // demarre l'animation
  var list = todolist;
  var u = valeuru;
  length = list.length ;
  x0 = (ctx.canvas.width/2/unit);
  x0 = x0 - (list.length)/2;
  x1 = x0 - 0.5;
  x2 = x1 + list.length + 1;
  // appel insere(list,x0,x1,x2,y,ctx)
  yield* insere(list,u,x0,x1,x2,topskip/skip,ctx);
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
    todolist = document.getElementById('list').value.split(' ');
    todolist = todolist.map(function(s){return parseInt(s,10);});
    valeuru = document.getElementById('list2').value;

    drawdata(startanim(ctx));
  }
}

function setlist() {
  document.getElementById('list').value = "1 2 4 5 6 7 8 9 10";
  document.getElementById('list2').value = "3";
}

var slider = document.getElementById('speed');
