window.addEventListener('load', (event) => {
    var tab = document.getElementById("table");
    var check= new Checkers(1);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        var c= check.convertxy(i,j);
        if (1==check.boarad[c]) {
          tab.rows[j].cells[i].innerHTML='<span class="white"></span>';
        }
        if (2==check.boarad[c]) {
          tab.rows[j].cells[i].innerHTML='<span class="black"></span>';
        }
      }
    }
      tab.addEventListener('click', (event) => {
        var x= Math.floor(event.clientX/tab.rows[0].cells[0].clientWidth);
        var y = Math.floor((event.clientY-100)/tab.rows[0].cells[0].clientHeight);
        console.log(x+" "+ y);
        console.log(event.target)
        if (check.checed!=null) {
          if (check.checed==check.convertxy(x,y)) {
            var c= check.convertxy(x,y);
            if(check.boarad[check.checed]==1){
              tab.rows[y].cells[x].innerHTML='<span class="white"></span>';
            }
            if(check.boarad[check.checed]==2){
              tab.rows[y].cells[x].innerHTML='<span class="black"></span>';
            }
            check.checed=null;
          }else{

          }
        }else{
          if (check.boarad[check.convertxy(x,y)]%2==check.own) {
            check.checed=check.convertxy(x,y);
            tab.rows[y].cells[x].innerHTML='<span class="marked"></span>';
            check.checkMoves(x,y);
            check.moves.forEach(element => {
              var move = check.convertId(element);
              tab.rows[move[1]].cells[move[0]].className="movefield";
            });
          }
        }
      })
  });