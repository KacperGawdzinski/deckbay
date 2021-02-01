window.addEventListener('load', (event) => {
  var socket = io();
  socket.on('connect', () => {
      $.ajax({
          type: "POST",
          url: "/set-socket-id",
          data: {socketid: socket.id},
          success: function(data) {
            if (data=='') {
              window.location.href ='/';
            }else{
              let room_name = data.substr(data.indexOf('-')+1, data.length);
              let game_type = data.substr(0, data.indexOf('-'))
              socket.emit('join-new-room', { game: game_type, room: room_name });
              socket.emit("ask-options-checkers");
            }
          }
      })
   });
  var sendMessageButton = document.getElementById('message-submit');
  var msgBox = document.getElementById('message');
  var messagesBox = document.getElementById('messages');
  var tab = document.getElementById("table");
  var head = document.getElementById("head");
  var button = document.getElementById("ready_self");
  var label = document.getElementById("ready_oponent");
  var labeld = document.getElementById("draw_oponent");
  var surr = document.getElementById("surrender");
  var draw = document.getElementById("draw");
  var undo = document.getElementById("undo");
  var ending = document.getElementById("endofgame");
  var divend = document.getElementById("endofgamediv");
  var options = false;
  var check;

   surr.addEventListener("click", () =>{
    check.turn==-1;
    socket.emit("surrender-checkers");
   })

   socket.on("surrender", () =>{
      check.turn=-1;
      divend.innerHTML=divend.innerHTML+"<br> Surennder"
      ending.style.visibility="visible";
   })

   draw.addEventListener("click", () =>{
     if (draw.style.color == "green") {
      draw.style.color = "white";
     } else {
      draw.style.color = "green";
     }
      socket.emit("draw-checkers");
  })

  socket.on("players-draw", (draw) => {
    if (draw == 1) {
      check.turn=-1;
      divend.innerHTML=divend.innerHTML+"<br> Draw"
      ending.style.visibility="visible";
    }
    labeld.style.display="none";
    button.style.display='none';
  });

  socket.on("change-draw", (player) => {
    if (check.own != player) {
      if (labeld.className == 'labelR') {
        labeld.className = 'labelNR';
      }else{
        labeld.className = 'labelR';
      }
    }
  });

  sendMessageButton.addEventListener('click', (ev) => {
    ev.preventDefault();
    socket.emit( 'message-sent-to-server', msgBox.value );
    msgBox.value = '';
  });
  socket.on('message-sent-to-client', (msg, user, time) => {
    const newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add('message-container');
    newMessageDiv.innerHTML = `<p class='meta'>${user} <div> ${time}</div></p>
                              <p class='msg'>${msg}</p>`;
    messagesBox.appendChild( newMessageDiv );
  });

  undo.addEventListener("click", () => {
     if (check.turn == 0) {
       socket.emit("undo-checkers");
     }
  })
  socket.on("undo-server", (boar) => {
    check.boarad=boar;
    if (check.turn == 1) {
      check.turn = 0;
    }else{
      check.turn = 1;
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        var c= check.convertxy(i,j);
        if (1==check.boarad[c]) {
          tab.rows[j].cells[i].innerHTML='<div class="white"></div>';
        }
        if (2==check.boarad[c]) {
          tab.rows[j].cells[i].innerHTML='<div class="black"> </div>';
        }
        if(3==check.boarad[c]){
          tab.rows[j].cells[i].innerHTML='<div class="whiteQ"> </div>';
        }
        if(4==check.boarad[c]){
          tab.rows[j].cells[i].innerHTML='<div class="blackQ"></div>';
        }
        if (0==check.boarad[c]) {
          tab.rows[j].cells[i].innerHTML=' ';
        }
      }
    }
  });

  socket.on("send-options-checkers", temp => {
    console.log("gunwo");
    if(!options){
      if (temp.length == 3) {
        check = new Checkers(temp[0]);
        check.updateBoard(temp[2]);
      }else{
        check = new Checkers(temp[0]);
      }
      socket.emit('ready-check');
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          var c= check.convertxy(i,j);
          if (1==check.boarad[c]) {
            tab.rows[j].cells[i].innerHTML='<div class="white"></div>';
          }
          if (2==check.boarad[c]) {
            tab.rows[j].cells[i].innerHTML='<div class="black"></div>';
          }
        }
      }
      options=true;
    }
  });

  socket.on("players-ready", (turn) => {
    if (check.own == turn) {
      check.turn=1;
    }else{
      check.turn=0;
    }
    label.style.display="none";
    button.style.display='none';
  });

  socket.on("change-ready", (player) => {
    if (check.own != player) {
      if (label.className == 'labelNR') {
        label.className = 'labelR';
      }else{
        label.className = 'labelNR';
      }
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
          tab.rows[j].cells[i].innerHTML='<div class="white"></div>';
        }
        if (2==check.boarad[c]) {
          tab.rows[j].cells[i].innerHTML='<div class="black"></div>';
        }
        if(3==check.boarad[c]){
          tab.rows[j].cells[i].innerHTML='<div class="whiteQ"></div>';
        }
        if(4==check.boarad[c]){
          tab.rows[j].cells[i].innerHTML='<div class="blackQ"></div>';
        }
        if (0==check.boarad[c]) {
          tab.rows[j].cells[i].innerHTML='';
        }
      }
    }
  });

  button.addEventListener('click', () => {
    if (button.style.color == "green") {
      button.style.color = "white";
     } else {
      button.style.color = "green";
     }
     socket.emit("ready");
  });

    tab.addEventListener('click', (event) => {
      var x= Math.floor(event.clientX/tab.rows[0].cells[0].clientWidth);
      var y = Math.floor((event.clientY-head.clientHeight)/tab.rows[0].cells[0].clientHeight);
      if (check.turn==1 && check.own>=0) {
        if (check.checed!=null) {
          if (check.checed==check.convertxy(x,y)) {
            var c= check.convertxy(x,y);
            if(check.boarad[check.checed]==1){
              tab.rows[y].cells[x].innerHTML='<div class="white"></div>';
            }
            if(check.boarad[check.checed]==2){
              tab.rows[y].cells[x].innerHTML='<div class="black"></div>';
            }
            if(check.boarad[check.checed]==3){
              tab.rows[y].cells[x].innerHTML='<div class="whiteQ"></div>';
            }
            if(check.boarad[check.checed]==4){
              tab.rows[y].cells[x].innerHTML='<div class="blackQ"></div>';
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
              socket.emit("check-move-checkers",tab);
            }
          }
        }else{
          check.checkIfCan();
          console.log(check.haveToMove);
          if (check.haveToMove.length!=0 && !check.inHaveToMove(check.convertxy(x,y))) {
          } else {
            if (check.haveToMove.length > 0) {
              if (check.boarad[check.convertxy(x,y)]%2==check.own) {
                check.checed=check.convertxy(x,y);
                tab.rows[y].cells[x].innerHTML='<div class="marked"></div>';
                check.checkBeating(x,y,-1);
                check.moves.forEach(element => {
                  var move = check.convertId(element);
                  tab.rows[move[1]].cells[move[0]].className="movefield";
                });
              }
            } else {
              if (check.boarad[check.convertxy(x,y)]%2==check.own) {
                check.checed=check.convertxy(x,y);
                tab.rows[y].cells[x].innerHTML='<div class="marked"></div>';
                check.checkMoves(x,y);
                check.moves.forEach(element => {
                  var move = check.convertId(element);
                  tab.rows[move[1]].cells[move[0]].className="movefield";
                });
              }
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
        element.innerHTML='<div class="white"> </div>';
      }
      if(check.boarad[id]==2){
        element.innerHTML='<div class="black"> </div>';
      }
      if(check.boarad[id]==3){
        element.innerHTML='<div class="whiteQ"> </div>';
      }
      if(check.boarad[id]==4){
        element.innerHTML='<div class="blackQ"> </div>';
      }
    }
    function settingEmpty(element){
        element.innerHTML=' ';
    }
    function settingFields(){
      check.moves.forEach(element => {
        var move = check.convertId(element);
        tab.rows[move[1]].cells[move[0]].className="field1";
      });
    }
});