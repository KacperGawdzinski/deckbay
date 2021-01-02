class Checkers{

    constructor(own){
        this.boarad=[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2];
        if (own==1) {
            this.own=1;
            this.enemy=0;
        } else {
            this.own=0;
            this.enemy=1;
        }
        this.checed=null;
        this.turn=own%2;
        this.moves=[];
        this.haveToMove=[];
        this.deleting=[];
        this.deletingtemp=[];
    }

    setNewBoard(){
        this.boarad=[1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2];
    }

    click(x,y){
        if (this.haveToMove) {
            if (this.inHaveToMove(this.convertxy(x,y))) {
                this.markPawn(x,y);
                this.makeMove(x,y);
            }
        }else{
            this.markPawn(x,y);
            this.makeMove(x,y);
        }
        this.checkQueens;
    }

    convertxy(x,y){
        if (this.checkIfWhite(x,y)|| y>7 || x>7 || y<0 || x<0) {
            return false;
        } else {
            return Math.floor(x/2)+y*4;
        }
    }

    checkPawn(x,y,worb){
        if (this.checkIfWhite(x,y)) {
            return false;
        } else {
            if (this.boarad[this.convertxy(x,y)]%2==worb) {
                return true;
            } else {
                return false;
            }
        }
    }

    checkIfWhite(x,y){
        return ((y%2==1&&x%2==1) || (y%2==0&&x%2==0));
    }

    markPawn(x,y){
        if (this.convertxy(x,y)===this.checed) {
            this.checed=null;
            this.moves=[];
        }else{
            if(this.checkPawn(x,y, this.own)){
                this.checed=this.convertxy(x,y);
                this.moves=this.checkBeating(x,y,-1);
            }
        }
        this.checkMoves();
    }

    ifEmpty(x,y){
        if(this.boarad[this.convertxy(x,y)]==0){
            return true;
        }else{
            return false;
        }
    }

    checkBeating(x,y,way){
        if (x-2>=0||y-2>=0) {
            if (this.ifEmpty(x-2,y-2) && way != 1) {
                if (this.checkPawn(x-1,y-1,this.enemy)) {
                    this.moves.push(this.convertxy(x-2,y-2));
                    this.checkBeating(x-2,y-2,4);
                }
            }
        }
        if (x-2>=0||y+2<=7) {
            if (this.ifEmpty(x-2,y+2)&& way != 2) {
                if (this.checkPawn(x-1,y+1,this.enemy)) {
                    this.moves.push(this.convertxy(x-2,y+2));
                    this.checkBeating(x-2,y+2,3);
                }
            }
        }
        if (x+2<=7||y-2>=0) {
            if (this.ifEmpty(x+2,y-2) && way != 3) {
                if (this.checkPawn(x+1,y-1,this.enemy)) {
                    this.moves.push(this.convertxy(x+2,y-2));
                    this.checkBeating(x+2,y-2,2);
                }
            }
        }
        if (x+2<=7||y+2<=7) {
            if (this.ifEmpty(x+2,y+2) && way != 4) {
                if (this.checkPawn(x+1,y+1,this.enemy)) {
                    this.moves.push(this.convertxy(x+2,y+2));
                    this.checkBeating(x+2,y+2,1);
                }
            }
        }
    }
    
    beat(x,y,xz,yz,way){
        if (x==xz && y==yz) {
            this.deleting=[...this.deletingtemp];
        }
        if ((x-2>=0||y-2>=0)) {
            if (this.inMoves(this.convertxy(x-2,y-2)) && way!=1) {
                this.deletingtemp.push(this.convertxy(x-1,y-1));
                this.beat(x-2,y-2,xz,yz,4);
            }
        }
        if ((x-2>=0||y+2<=7)) {
            if (this.inMoves(this.convertxy(x-2,y+2))&& way!=2) {
                this.deletingtemp.push(this.convertxy(x-1,y+1));
                this.beat(x-2,y+2,xz,yz,3);
            }
        }
        if ((x+2<=7||y-2>=0)) {
            if (this.inMoves(this.convertxy(x+2,y-2))&& way!=3) {
                this.deletingtemp.push(this.convertxy(x+1,y-1));
                this.beat(x+2,y-2,xz,yz,2);
            }
        }
        if ((x+2<=7||y+2<=7)) {
            if (this.inMoves(this.convertxy(x+2,y+2))&& way!=4) {
                this.deletingtemp.push(this.convertxy(x+1,y+1));
                this.beat(x+2,y+2,xz,yz,1);
            }
        }
        this.deletingtemp.pop();
    }

    convertId(id){
        var x, y;
        if(Math.floor(id/4)%2==0){
            x=(id%4)*2+1;
            y=(Math.floor(id/4));
        }else{
            x=(id%4)*2;
            y=(Math.floor(id/4));
        }
        return [x,y];
    }

    checkMoves(x,y){
        if (this.own==1) {
            if (this.boarad[this.convertxy(x,y)]==(this.own)) {
                if (this.boarad[this.convertxy(x+1,y+1)]==0) {
                    this.moves.push(this.convertxy(x+1,y+1));
                }
                if (this.boarad[this.convertxy(x-1,y+1)]==0) {
                    this.moves.push(this.convertxy(x-1,y+1));
                }
                if (this.boarad[this.convertxy(x+2,y+2)]==0 && (this.boarad[this.convertxy(x+1,y+1)]==2 || this.boarad[this.convertxy(x+1,y+1)]==4)) {
                    this.moves.push(this.convertxy(x+2,y+2));
                    this.checkBeating(x+2,y+2,-1);
                }
                if (this.boarad[this.convertxy(x-2,y+2)]==0 && (this.boarad[this.convertxy(x-1,y+1)]==2 || this.boarad[this.convertxy(x-1,y+1)]==4)) {
                    this.moves.push(this.convertxy(x-2,y+2));
                    this.checkBeating(x-2,y+2,-1);
                }
            }else{                
                if (this.boarad[this.convertxy(x,y)]==(this.own)+2){
                    let i=1;
                    while (this.boarad[this.convertxy(x-i,y+i)]==0) {
                        this.moves.push(this.convertxy(x-i,y+i));
                        i++;
                    }
                    if ((this.boarad[this.convertxy(x-i,y+i)]==this.enemy+2 || this.boarad[this.convertxy(x-i,y+i)]==this.enemy+4) && 
                    this.boarad[this.convertxy(x-i-1,y+i+1)]==0) {
                        this.moves.push(this.convertxy(x-i-1,y+i+1));
                        this.checkBeating(x-i-1,y+i+1,-1);
                    }
                    i=1;
                    while (this.boarad[this.convertxy(x+i,y+i)]==0) {
                        this.moves.push(this.convertxy(x+i,y+i));
                        i++;
                    }
                    if ((this.boarad[this.convertxy(x+i,y+i)]==this.enemy+2 || this.boarad[this.convertxy(x+i,y+i)]==this.enemy+4) && 
                    this.boarad[this.convertxy(x+i+1,y+i+1)]==0) {
                        this.moves.push(this.convertxy(x+i+1,y+i+1));
                        this.checkBeating(x+i+1,y+i+1,-1);
                    }
                    i=1;
                    while (this.boarad[this.convertxy(x-i,y-i)]==0) {
                        this.moves.push(this.convertxy(x-i,y-i));
                        i++;
                    }
                    if ((this.boarad[this.convertxy(x-i,y-i)]==this.enemy+2 || this.boarad[this.convertxy(x-i,y-i)]==this.enemy+4) && 
                    this.boarad[this.convertxy(x-i-1,y-i-1)]==0) {
                        this.moves.push(this.convertxy(x-i-1,y-i-1));
                        this.checkBeating(x-i-1,y-i-1,-1);
                    }
                    i=1;
                    while (this.boarad[this.convertxy(x+i,y-i)]==0) {
                        this.moves.push(this.convertxy(x+i,y-i));
                        i++;
                    }
                    if ((this.boarad[this.convertxy(x+i,y-i)]==this.enemy+2 || this.boarad[this.convertxy(x+i,y-i)]==this.enemy+4) && 
                    this.boarad[this.convertxy(x+i+1,y-i-1)]==0) {
                        this.moves.push(this.convertxy(x+i+1,y-i-1));
                        this.checkBeating(x+i+1,y-i-1,-1);
                    }
                }
            }
        }else{
            if (this.boarad[this.convertxy(x,y)]==2+(this.own)) {
                if (this.boarad[this.convertxy(x+1,y-1)]==0) {
                    this.moves.push(this.convertxy(x+1,y-1));
                }
                if (this.boarad[this.convertxy(x-1,y-1)]==0) {
                    this.moves.push(this.convertxy(x-1,y-1));
                }
                if (this.boarad[this.convertxy(x+2,y-2)]==0 && (this.boarad[this.convertxy(x+1,y-1)]==1 || this.boarad[this.convertxy(x+1,y-1)]==3)) {
                    this.moves.push(this.convertxy(x+2,y-2));
                    this.checkBeating(x+2,y-2,-1);
                }
                if (this.boarad[this.convertxy(x-2,y-2)]==0 && (this.boarad[this.convertxy(x-1,y-1)]==1 || this.boarad[this.convertxy(x-1,y-1)]==3)) {
                    this.moves.push(this.convertxy(x-2,y-2));
                    this.checkBeating(x-2,y-2,-1);
                }
            }else{
                if (this.boarad[this.convertxy(x,y)]==4+(this.own)) {
                    let i=1;
                    while (this.boarad[this.convertxy(x-i,y+i)]==0) {
                        this.moves.push(this.convertxy(x-i,y+i));
                        i++;
                    }
                    if ((this.boarad[this.convertxy(x-i,y+i)]==this.enemy || this.boarad[this.convertxy(x-i,y+i)]==this.enemy+2) && 
                    this.boarad[this.convertxy(x-i-1,y+i+1)]==0) {
                        this.moves.push(this.convertxy(x-i-1,y+i+1));
                        this.checkBeating(x-i-1,y+i+1,-1);
                    }
                    i=1;
                    while (this.boarad[this.convertxy(x+i,y+i)]==0) {
                        this.moves.push(this.convertxy(x+i,y+i));
                        i++;
                    }
                    if ((this.boarad[this.convertxy(x+i,y+i)]==this.enemy || this.boarad[this.convertxy(x+i,y+i)]==this.enemy+2) && 
                    this.boarad[this.convertxy(x+i+1,y+i+1)]==0) {
                        this.moves.push(this.convertxy(x+i+1,y+i+1));
                        this.checkBeating(x+i+1,y+i+1,-1);
                    }
                    i=1;
                    while (this.boarad[this.convertxy(x-i,y-i)]==0) {
                        this.moves.push(this.convertxy(x-i,y-i));
                        i++;
                    }
                    if ((this.boarad[this.convertxy(x-i,y-i)]==this.enemy || this.boarad[this.convertxy(x-i,y-i)]==this.enemy+2) && 
                    this.boarad[this.convertxy(x-i-1,y-i-1)]==0) {
                        this.moves.push(this.convertxy(x-i-1,y-i-1));
                        this.checkBeating(x-i-1,y-i-1,-1);
                    }
                    i=1;
                    while (this.boarad[this.convertxy(x+i,y-i)]==0) {
                        this.moves.push(this.convertxy(x+i,y-i));
                        i++;
                    }
                    if ((this.boarad[this.convertxy(x+i,y-i)]==this.enemy || this.boarad[this.convertxy(x+i,y-i)]==this.enemy+2) && 
                    this.boarad[this.convertxy(x+i+1,y-i-1)]==0) {
                        this.moves.push(this.convertxy(x+i+1,y-i-1));
                        this.checkBeating(x+i+1,y-i-1,-1);
                    }
                }
            }
        }
    }

    inMoves(id){
        let x=false;
        this.moves.forEach(element => {
            if (element==id) {
                x=true;
            }
        });
        return x;
    }
    inHaveToMove(id){
        let x=false;
        this.haveToMove.forEach(element => {
            if (element==id) {
                x=true;
            }
        });
        return x;
    }
    checkIfCan(){
        this.boarad.forEach(element => {
            this.haveToMove=[];
            var temp = this.convertId(elemnet);
            if (this.checkBeating(temp[0],temp[1])) {
                this.haveToMove.push(element);
            }
        });
    }

    makeMove(xz,yz){
        var temp = this.convertId(this.checed);
        var x = temp[0];
        var y = temp[1];
        if (this.checed!=null) {
            if (this.inMoves(this.convertxy(xz,yz))) {
                if (this.boarad[this.checed]==3 || this.boarad[this.checed]==4) {
                    let i=1;
                    while (this.boarad[this.convertxy(x-i,y+i)]==0) {
                        i++;
                    }
                    if (this.inMoves(this.convertxy(x-i-1,y+i+1))) {
                        this.boarad[this.convertxy(x-i,y+i)]=0;
                        this.beat(x-i-1,y+i+1,xz,yz,-1);
                    }
                    i=1;
                    while (this.boarad[this.convertxy(x+i,y+i)]==0) {
                        i++;
                    }
                    if (this.inMoves[this.convertxy(x+i+1,y+i+1)]) {
                        this.boarad[this.convertxy(x+i,y+i)]=0;
                        this.beat(x+i+1,y+i+1,xz,yz,-1);
                    }
                    i=1;
                    while (this.boarad[this.convertxy(x-i,y-i)]==0) {
                        i++;
                    }
                    if (this.inMoves[this.convertxy(x-i-1,y-i-1)]) {
                        this.boarad[this.convertxy(x-i,y-i)]=0;
                        this.beat(x-i-1,y-i-1,xz,yz,-1);
                    }
                    i=1;
                    while (this.boarad[this.convertxy(x+i,y-i)]==0) {
                        i++;
                    }
                    if (this.inMoves[this.convertxy(x+i+1,y-i-1)]) {
                        this.boarad[this.convertxy(x+i,y-i)]=0;
                        this.beat(x+i+1,y-i-1,xz,yz,-1);
                    }
                    }else{
                        this.beat(x,y,xz,yz,-1);
                    }
                    this.boarad[this.convertxy(xz,yz)]=this.boarad[this.checed];
                    this.boarad[this.checed]=0;
                    this.checed=null;
                    this.moves=[];
            }
        } 
    }

    checkQueens(){
                for (let i = 27; i < this.boarad.length; i++) {
                    const element = this.boarad[i];
                    if (element==1) {
                        this.boarad[i]+= 2;
                    }
                }
                for (let i = 4; i > -1 ; i--) {
                    const element = this.boarad[i];
                    if (element==2) {
                        this.boarad[i]+= 2;
                    }
                }
            
    }

    updateBoard(board){
        this.boarad=board;
    }

    updateOwn(own){
        if (own==1) {
            this.own=1;
            this.enemy=0;
        } else {
            this.own=0;
            this.enemy=1;
        }
    }

    deletingBeated(){
        this.deleting.forEach(element => {
            this.boarad[element]=0;
        });
    }
}

module.exports = Checkers;