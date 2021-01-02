window.addEventListener('load', (event) => {
  const socket = io(); // change to serwer url
  var tab = document.getElementById("table");
  var head = document.getElementById("head");
  var options = false;
  socket.emit('join-new-room', { game: "checkers", room: room_name} );
  socket.emit("ask-options-checkers");
  var check;
  socket.on("send-options-checkers", temp => {
    if(!options){    
      if (temp.length == 2) {
        check = new Checkers(temp[0]);
        check.updateBoard(temp[1]);
      }else{
        check = new Checkers(temp[0]);
      }
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
      options=true;
    }
  });

  socket.on('move', temp => {
    var trueOwn = check.own;
    check.updateOwn(temp[2]);
    var x = check.convertId(temp[1])[0];
    var y = check.convertId(temp[1])[1];
    check.checed=temp[0];
    settingPawan(tab.rows[y].cells[x], temp[0]);
    let moves = check.convertId(temp[0]);
    settingEmpty(tab.rows[moves[1]].cells[moves[0]]);
    settingFields();
    check.checkMoves(check.convertId(temp[0])[0],check.convertId(temp[0])[1])
    check.makeMove(x,y);
    check.updateOwn(trueOwn);
    check.deletingBeated();
    deleting();
    check.checkQueens();
    check.deleting=[];
    check.checed=null;
    if (check.own==temp[2]) {
      check.turn=0;
    }else{
      check.turn=1;
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        var c= check.convertxy(i,j);
        if (1==check.boarad[c]) {
          tab.rows[j].cells[i].innerHTML='<span class="white"></span>';
        }
        if (2==check.boarad[c]) {
          tab.rows[j].cells[i].innerHTML='<span class="black"></span>';
        }
        if(3==check.boarad[c]){
          tab.rows[j].cells[i].innerHTML='<span class="whiteQ"></span>';
        }
        if(4==check.boarad[c]){
          tab.rows[j].cells[i].innerHTML='<span class="blackQ"></span>';
        }
        if (0==check.boarad[c]) {
          tab.rows[j].cells[i].innerHTML='';
        }
      }
    }
  });

    tab.addEventListener('click', (event) => {
      var x= Math.floor(event.clientX/tab.rows[0].cells[0].clientWidth);
      var y = Math.floor((event.clientY-head.clientHeight)/tab.rows[0].cells[0].clientHeight);
      if (check.turn==1) {
        if (check.checed!=null) {
          if (check.checed==check.convertxy(x,y)) {
            var c= check.convertxy(x,y);
            if(check.boarad[check.checed]==1){
              tab.rows[y].cells[x].innerHTML='<span class="white"></span>';
            }
            if(check.boarad[check.checed]==2){
              tab.rows[y].cells[x].innerHTML='<span class="black"></span>';
            }
            if(check.boarad[check.checed]==3){
              tab.rows[y].cells[x].innerHTML='<span class="whiteQ"></span>';
            }
            if(check.boarad[check.checed]==4){
              tab.rows[y].cells[x].innerHTML='<span class="blackQ"></span>';
            }
            check.checed=null;
            check.moves.forEach(element => {
              var move = check.convertId(element);
                tab.rows[move[1]].cells[move[0]].className = "field1";
            });
            check.moves=[];
          }else{
            let pos=check.convertxy(x,y);
            if (check.inMoves(pos)) {
              let tab=[check.checed,pos,check.own];
              socket.emit("check-move",tab);
            }
          }
        }else{
          if (check.haveToMove.length!=0 && !check.inHaveToMove(check.convertxy(x,y))) {
          } else {
            if (check.boarad[check.convertxy(x,y)]%2==check.own) {
              check.checed=check.convertxy(x,y);
              tab.rows[y].cells[x].innerHTML='<span class="marked"></span>';
              check.checkMoves(x,y);
              console.log(check.moves);
              check.moves.forEach(element => {
                var move = check.convertId(element);
                tab.rows[move[1]].cells[move[0]].className="movefield";
              });
            }
          }
        }
      }
    });

    function queens() {
      check.checkQueens();
      if (check.own%2==1) {
        for (let i = 27; i < check.boarad.length; i++) {
            if (check.boarad[i]==3) {
              let temp=check.convertId(i);
              settingPawan(tab.rows[temp[1]].cells[temp[0]], i);
            }
        }
      }else{
        for (let i = 4; i > -1 ; i--) {
            if (check.boarad[i]==4) {
              let temp=check.convertId(i);
              settingPawan(tab.rows[temp[1]].cells[temp[0]], i);
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
    function settingPawan(element, id){
      if(check.boarad[id]==1){
        element.innerHTML='<span class="white"></span>';
      }
      if(check.boarad[id]==2){
        element.innerHTML='<span class="black"></span>';
      }
      if(check.boarad[id]==3){
        element.innerHTML='<span class="whiteQ"></span>';
      }
      if(check.boarad[id]==4){
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

