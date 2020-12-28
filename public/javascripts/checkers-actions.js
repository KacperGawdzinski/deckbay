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
            check.moves.forEach(element => {
              var move = check.convertId(element);
              if (check.checkIfWhite(move[0],move[1])) {
                tab.rows[move[1]].cells[move[0]].className = "field2";
              }else{
                tab.rows[move[1]].cells[move[0]].className = "field1";
              }
            });
            check.moves=[];
          }else{
            let pos=check.convertxy(x,y);
            if (check.inMoves(pos)) {
              tab.rows[y].cells[x].className = "field1";
              settingPawan(tab.rows[y].cells[x]);
              settingFields();
              let moves = check.convertId(check.checed);
              settingEmpty(tab.rows[moves[1]].cells[moves[0]]);
              check.makeMove(x,y);
              deleting();
              queens();
            }
          }
        }else{
          if (check.haveToMove.length!=0 && !check.inHaveToMove(check.convertxy(x,y))) {
            
          } else {
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
        }
      })
      function queens() {
        checkQueens();
        if (own%2==1) {
          for (let i = 27; i < this.boarad.length; i++) {
              if (this.boarad[i]==3) {
                let temp=check.convertId(i);
                settingPawan(tab.rows[temp[1]].cells[temp[0]]);
              }
          }
        }else{
          for (let i = 4; i > -1 ; i--) {
              if (this.boarad[i]==4) {
                let temp=check.convertId(i);
                settingPawan(tab.rows[temp[1]].cells[temp[0]]);
              }
          }
        }
      }
      function deleting() {
        check.deleting.forEach(element => {
          let del=check.convertId(element);
          tab.rows[del[1]].cells[del[0]].innerHTML='';
        });
      }
      function settingPawan(element){
        if(check.boarad[check.checed]==1){
          element.innerHTML='<span class="white"></span>';
        }
        if(check.boarad[check.checed]==2){
          element.innerHTML='<span class="black"></span>';
        }
        if(check.boarad[check.checed]==3){
          element.innerHTML='<span class="whiteQ"></span>';
        }
        if(check.boarad[check.checed]==4){
          element.innerHTML='<span class="blackQ"></span>';
        }
      }
      function settingEmpty(element){
          element.innerHTML='';
      }
      function settingFields(){
        check.moves.forEach(element => {
          var move = check.convertId(element);
          tab.rows[move[1]].cells[move[0]].className="field1";
        });
      }
  });

