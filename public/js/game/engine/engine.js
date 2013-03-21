var action={doTheBuild:function(a,b){100>b.cp?production.updateConstruction(b):a.a=null},doTheAttack:function(a,b){0==gameLoop.iterate%gameData.ELEMENTS[a.f][a.r][a.t].attackSpeed&&fightLogic.attack(a,b)},doTheGathering:function(a,b){0==gameLoop.iterate%gameData.ELEMENTS[a.f][a.r][a.t].gatheringSpeed&&production.gatherResources(a,b)}};var AI={RESOURCE_DISTANCE_THRESHOLD:10,searchForNewResources:function(a,b,c){c=mapLogic.getNearestResource(b,c);tools.getElementsDistance(b,c)<this.RESOURCE_DISTANCE_THRESHOLD?(a.a=c,a.pa=c):(a.a=null,a.pa=null)}};var engineManager={createNewGame:function(a,b){for(var c in b){var d=b[c],e;for(e in a.ir.re)d.re.push(a.ir.re[e].value);for(var f in b)f==c?d.ra.push(gameData.RANKS.me):d.ra.push(gameData.RANKS.enemy);gameLogic.players.push(d)}mapLogic.createNewMap(a,b)},startGame:function(){gameLoop.start()},pauseGame:function(){}};var fightLogic={weaponsEfficiency:[[1,1],[1,1]],attack:function(a,b){var c=parseInt(gameData.ELEMENTS[a.f][a.r][a.t].attack*this.weaponsEfficiency[gameData.ELEMENTS[a.f][a.r][a.t].weaponType][gameData.ELEMENTS[b.f][b.r][b.t].armorType]*(1+0.2*Math.random()))-gameData.ELEMENTS[b.f][b.r][b.t].defense;this.applyDamage(c,b,a)},applyDamage:function(a,b,c){b.l-=a;null!=c&&0>=b.l&&(c.frag+=1,c.a=null)}};var gameData={FAMILIES:{unit:0,building:1,terrain:2},ELEMENTS:[[],[],[]],RANKS:{me:0,ally:1,neutral:2,enemy:3},unitId:0,createUniqueId:function(){this.unitId+=10;return(new Date).getMilliseconds()+this.unitId}};var gameLogic={players:[],gameElements:[],grid:[],update:function(){for(var a in this.gameElements){var b=this.gameElements[a];this.resolveActions(b);this.updateMoves(b);this.updateBuildings(b)}this.updateFogOfWar();this.removeDeads();this.checkGameOver()},updateMoves:function(a){null!=a.mt&&null!=a.mt.x&&move.moveElement(a)},resolveActions:function(a){if(null!=a.a)if(1>=tools.getElementsDistance(a,a.a))a.mt={x:null,y:null},gameData.ELEMENTS[a.f][a.r][a.t].isBuilder&&a.a.f==gameData.FAMILIES.building&&
rank.isAlly(a.o,a.a)?100>a.a.cp?action.doTheBuild(a,a.a):null!=a.ga&&production.getBackResources(a):gameData.ELEMENTS[a.f][a.r][a.t].isBuilder&&a.a.f==gameData.FAMILIES.terrain?action.doTheGathering(a,a.a):rank.isAlly(a.o,a.a)||action.doTheAttack(a,a.a);else{var b=tools.getClosestPart(a,a.a);a.mt={x:b.x,y:b.y}}},removeDeads:function(){for(var a=gameLogic.gameElements.length;a--;){var b=gameLogic.gameElements[a];if(0>=b.l||0==b.ra)b.f!=gameData.FAMILIES.terrain&&(b.f==gameData.FAMILIES.building?production.removeBuilding(b):
b.f==gameData.FAMILIES.unit&&production.removeUnit(b)),this.removeElement(a),mapLogic.removeGameElement(b)}},checkGameOver:function(){},updateBuildings:function(a){a.f==gameData.FAMILIES.building&&0<a.q.length&&production.updateQueueProgress(a)},updateFogOfWar:function(){},removeElement:function(a){this.gameElements.splice(a,1)}};var gameLoop={FREQUENCY:10,iterate:0,start:function(){setInterval(function(){gameLoop.update()},1E3/this.FREQUENCY)},update:function(){this.iterate=100<this.iterate?0:this.iterate+1;gameLogic.update()}};var move={moveElement:function(a){for(var b=gameLogic.grid[a.mt.x][a.mt.y],c=0;b.isWall&&20>c;){c++;var d=astar.neighbors(gameLogic.grid,b,!0),e;for(e in d)if(!d[e].isWall){b=d[e];a.mt={x:b.x,y:b.y};break}}b=astar.search(gameLogic.grid,gameLogic.grid[a.p.x][a.p.y],b,!0);if(0<b.length){for(c=gameData.ELEMENTS[a.f][a.r][a.t].speed;c>b.length;)c--;if(null!=b[c-1]){b={x:b[c-1].x,y:b[c-1].y};if(!gameLogic.grid[b.x][b.y].isWall){c=gameData.ELEMENTS[a.f][a.r][a.t].shape;for(e in c)for(var f in c[e])0<c[e][f]&&
(d=tools.getPartPosition(a,e,f),gameLogic.grid[d.x][d.y].isWall=!1);a.p=b;for(e in c)for(f in c[e])0<c[e][f]&&(d=tools.getPartPosition(a,e,f),gameLogic.grid[d.x][d.y].isWall=!0)}a.mt.x==a.p.x&&a.mt.y==a.p.y&&(a.mt={x:null,y:null})}}}},astar={init:function(a){for(var b=0,c=a.length;b<c;b++)for(var d=0,e=a[b].length;d<e;d++){var f=a[b][d];f.f=0;f.g=0;f.h=0;f.cost=1;f.visited=!1;f.closed=!1;f.parent=null}},heap:function(){return new BinaryHeap(function(a){return a.f})},search:function(a,b,c,d,e){astar.init(a);
e=e||astar.manhattan;d=!!d;var f=astar.heap();for(f.push(b);0<f.size();){b=f.pop();if(b===c||4<f.size){a=b;for(c=[];a.parent;)c.push(a),a=a.parent;return c.reverse()}b.closed=!0;for(var g=astar.neighbors(a,b,d),h=0,k=g.length;h<k;h++){var j=g[h];if(!j.closed&&!j.isWall){var l=b.g+j.cost,m=j.visited;if(!m||l<j.g)j.visited=!0,j.parent=b,j.h=j.h||e(j,c),j.g=l,j.f=j.g+j.h,m?f.rescoreElement(j):f.push(j)}}}return[]},manhattan:function(a,b){var c=Math.abs(b.x-a.x),d=Math.abs(b.y-a.y);return c+d},neighbors:function(a,
b,c){var d=[],e=b.x;b=b.y;a[e-1]&&a[e-1][b]&&d.push(a[e-1][b]);a[e+1]&&a[e+1][b]&&d.push(a[e+1][b]);a[e]&&a[e][b-1]&&d.push(a[e][b-1]);a[e]&&a[e][b+1]&&d.push(a[e][b+1]);c&&(a[e-1]&&a[e-1][b-1]&&d.push(a[e-1][b-1]),a[e+1]&&a[e+1][b-1]&&d.push(a[e+1][b-1]),a[e-1]&&a[e-1][b+1]&&d.push(a[e-1][b+1]),a[e+1]&&a[e+1][b+1]&&d.push(a[e+1][b+1]));return d}};function BinaryHeap(a){this.content=[];this.scoreFunction=a}
BinaryHeap.prototype={push:function(a){this.content.push(a);this.sinkDown(this.content.length-1)},pop:function(){var a=this.content[0],b=this.content.pop();0<this.content.length&&(this.content[0]=b,this.bubbleUp(0));return a},remove:function(a){for(var b=this.content.length,c=0;c<b;c++)if(this.content[c]==a){var d=this.content.pop();c!=b-1&&(this.content[c]=d,this.scoreFunction(d)<this.scoreFunction(a)?this.sinkDown(c):this.bubbleUp(c));return}throw Error("Node not found.");},size:function(){return this.content.length},
rescoreElement:function(a){this.sinkDown(this.content.indexOf(a))},sinkDown:function(a){for(var b=this.content[a];0<a;){var c=Math.floor((a+1)/2)-1,d=this.content[c];if(this.scoreFunction(b)<this.scoreFunction(d))this.content[c]=b,this.content[a]=d,a=c;else break}},bubbleUp:function(a){for(var b=this.content.length,c=this.content[a],d=this.scoreFunction(c);;){var e=2*(a+1),f=e-1,g=null;if(f<b){var h=this.scoreFunction(this.content[f]);h<d&&(g=f)}if(e<b&&this.scoreFunction(this.content[e])<(null==
g?d:h))g=e;if(null!=g)this.content[a]=this.content[g],this.content[g]=c,a=g;else break}}};var order={TYPES:{action:0,buildThatHere:1,buy:2,cancelConstruction:3},dispatchReceivedOrder:function(a,b){switch(a){case 0:this.convertDestinationToOrder(b[0],b[1],b[2]);break;case 1:this.buildThatHere(b[0],b[1],b[2],b[3]);break;case 2:this.buy(b[0],b[1]);break;case 3:this.cancelConstruction(b[0])}},buildThatHere:function(a,b,c,d){a=tools.getGameElementsFromIds(a);b=new gameData.Building(b,c,d,a[0].o);production.startConstruction(b);this.build(a,b)},buy:function(a,b){var c=tools.getGameElementsFromIds(a);
production.buyElement(c,b)},cancelConstruction:function(a){a=tools.getGameElementsFromIds([a]);production.cancelConstruction(a[0])},updateRallyingPoint:function(a,b,c){for(var d in a){var e=a[d];0<gameData.ELEMENTS[e.f][e.r][e.t].buttons.length&&(e.rp={x:b,y:c})}},attack:function(a,b){for(var c in a){var d=a[c];d.pa=null;d.a=b}},build:function(a,b){for(var c in a){var d=a[c];d.pa=null;d.a=b}},move:function(a,b,c){for(var d in a){var e=a[d];e.pa=null;e.a=null;e.mt={x:b,y:c}}},gather:function(a,b){for(var c in a){var d=
a[c];d.a=b;d.pa=b}},convertDestinationToOrder:function(a,b,c){a=tools.getGameElementsFromIds(a);if(!(0==a.length||b>=gameLogic.grid[0].length||c>=gameLogic.grid.length))if(a[0].f==gameData.FAMILIES.building)this.updateRallyingPoint(a,b,c);else{var d=tools.getElementUnder(b,c);if(null!=d)if(d.f==gameData.FAMILIES.unit){if(!rank.isAlly(a[0].o,d)){this.attack(a,d);return}}else{if(d.f==gameData.FAMILIES.building){if(rank.isAlly(a[0].o,d))for(var e in a){var f=a[e];gameData.ELEMENTS[f.f][f.r][f.t].isBuilder?
order.build([f],d):order.move([f],b,c)}else order.attack(a,d);return}if(d.f==gameData.FAMILIES.terrain&&0<=gameData.ELEMENTS[d.f][0][d.t].resourceType){for(e in a)f=a[e],gameData.ELEMENTS[f.f][f.r][f.t].isBuilder?(order.gather([f],d),f.a=d):order.move([f],b,c);return}}order.move(a,b,c)}}};var production={startConstruction:function(a){var b=gameData.ELEMENTS[a.f][a.r][a.t];this.canBuyIt(a.o,b)&&(this.paysForElement(a.o,b),mapLogic.addGameElement(a))},updateConstruction:function(a){a.cp+=100/gameData.ELEMENTS[a.f][a.r][a.t].timeConstruction;a.c=gameData.ELEMENTS[a.f][a.r][a.t].constructionColors[parseInt((gameData.ELEMENTS[a.f][a.r][a.t].constructionColors.length-1)*a.cp/100)];100<=a.cp&&this.finishConstruction(a)},cancelConstruction:function(a){null!=a&&100>a.cp&&(a.l=0,this.sellsElement(a.o,
gameData.ELEMENTS[a.f][a.r][a.t]))},finishConstruction:function(a){a.cp=100;0<gameData.ELEMENTS[a.f][a.r][a.t].pop&&(gameLogic.players[a.o].pop.max+=gameData.ELEMENTS[a.f][a.r][a.t].pop)},removeBuilding:function(a){0<gameData.ELEMENTS[a.f][a.r][a.t].pop&&100==a.cp&&(gameLogic.players[a.o].pop.max-=gameData.ELEMENTS[a.f][a.r][a.t].pop)},gatherResources:function(a,b){if(null==a.ga||a.ga.t!=gameData.ELEMENTS[b.f][b.r][b.t].resourceType)a.ga={t:gameData.ELEMENTS[b.f][b.r][b.t].resourceType,amount:0};
var c=Math.min(gameData.ELEMENTS[a.f][a.r][a.t].maxGathering-a.ga.amount,5,b.ra);a.ga.amount+=c;b.ra-=c;a.ga.amount==gameData.ELEMENTS[a.f][a.r][a.t].maxGathering?(c=mapLogic.getNearestBuilding(a,gameData.ELEMENTS[gameData.FAMILIES.building][gameLogic.players[a.o].r][0].t),a.a=c):0==b.ra&&AI.searchForNewResources(a,a,gameData.ELEMENTS[a.pa.f][a.pa.r][a.pa.t].resourceType)},getBackResources:function(a){gameLogic.players[a.o].re[a.ga.t]+=a.ga.amount;a.ga=null;null!=a.pa&&(0==a.pa.ra?AI.searchForNewResources(a,
a.pa,gameData.ELEMENTS[a.pa.f][a.pa.r][a.pa.t].resourceType):a.a=a.pa)},buyElement:function(a,b){for(var c in a){var d=a[c];d.t==a[0].t&&(100==d.cp&&5>d.q.length&&this.canBuyIt(d.o,b))&&(this.paysForElement(d.o,b),d.q.push(b.t))}},updateQueueProgress:function(a){a.qp+=100/(gameLoop.FREQUENCY*gameData.ELEMENTS[gameData.FAMILIES.unit][a.r][a.q[0]].timeConstruction);if(100<=a.qp){var b=!0;0<gameData.ELEMENTS[gameData.FAMILIES.unit][a.r][a.q[0]].speed&&(b=this.createNewUnit(a.q[0],a));b?(a.qp=0,a.q.splice(0,
1)):a.qp=100}},createNewUnit:function(a,b){var c=gameData.ELEMENTS[gameData.FAMILIES.unit][b.r][a],d=tools.getTilesAroundElements(b),e=gameLogic.players[b.o].pop;return 0<d.length&&e.current+c.pop<=e.max?(d=d[d.length-1],c=new gameData.Unit(c,d.x,d.y,b.o),gameLogic.players[b.o].pop.current+=gameData.ELEMENTS[c.f][c.r][c.t].pop,mapLogic.addGameElement(c),null!=b.rp&&order.convertDestinationToOrder([c.id],b.rp.x,b.rp.y),!0):!1},removeUnit:function(a){0<gameData.ELEMENTS[a.f][a.r][a.t].pop&&(gameLogic.players[a.o].pop.current-=
gameData.ELEMENTS[a.f][a.r][a.t].pop)},canBuyIt:function(a,b){for(var c in b.needs){var d=b.needs[c];if(d.value>gameLogic.players[a].re[d.t])return!1}return!0},paysForElement:function(a,b){for(var c in b.needs){var d=b.needs[c];gameLogic.players[a].re[d.t]-=d.value}},sellsElement:function(a,b){for(var c in b.needs){var d=b.needs[c];gameLogic.players[a].re[d.t]+=parseInt(d.value/2)}},getWhatCanBeBought:function(a,b){var c=[],d;for(d in b){var e=b[d];e.isEnabled=this.canBuyIt(a,e);c.push(e)}return c}};var rank={isEnemy:function(a,b){return gameLogic.players[a].ra[b.o]==gameData.RANKS.ennemy?!0:!1},isAlly:function(a,b){return gameLogic.players[a].ra[b.o]==gameData.RANKS.me||gameLogic.players[a].ra[b.o]==gameData.RANKS.ally?!0:!1}};var tools={getPositionsDistance:function(a,b){return Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y))},getElementsDistance:function(a,b){var c=1E4;if(null!=b){var d=gameData.ELEMENTS[b.f][b.r][b.t].shape,e;for(e in d)for(var f in d[e]){var g=this.getPositionsDistance(a.p,this.getPartPosition(b,e,f));g<c&&(c=g);if(1==c)return c}}return c},getClosestPart:function(a,b){var c=1E4,d,e=gameData.ELEMENTS[b.f][b.r][b.t].shape,f;for(f in e)for(var g in e[f]){var h=this.getPositionsDistance(a.p,this.getPartPosition(b,
f,g));h<c&&(c=h,d=this.getPartPosition(b,f,g));if(1==c)return d}return d},getPartPosition:function(a,b,c){var d=null,d=null==a.shape?gameData.ELEMENTS[a.f][a.r][a.t].shape:a.shape;return{x:parseInt(a.p.x+parseInt(b)-parseInt(d[0].length/2)),y:parseInt(a.p.y+parseInt(c)-parseInt(d.length/2))}},isElementThere:function(a,b){var c=gameData.ELEMENTS[a.f][a.r][a.t].shape,d;for(d in c)for(var e in c[d])if(0<c[d][e]){var f=this.getPartPosition(a,d,e);if(f.x==b.x&&f.y==b.y)return!0}return!1},getTilesAroundElements:function(a){var b=
[],c=gameData.ELEMENTS[a.f][a.r][a.t].shape,d;for(d in c)for(var e in c[d])if(0<c[d][e]){var f=this.getPartPosition(a,d,e),f=astar.neighbors(gameLogic.grid,gameLogic.grid[f.x][f.y],!0),g;for(g in f){var h=f[g];h.isWall||b.push({x:h.x,y:h.y})}}return b},getElementUnder:function(a,b){for(var c in gameLogic.gameElements){var d=gameLogic.gameElements[c];if(tools.isElementThere(d,{x:a,y:b}))return d}return null},getGameElementsFromIds:function(a){var b=[],c;for(c in gameLogic.gameElements){var d=gameLogic.gameElements[c],
e;for(e in a)if(d.id==a[e]){b.push(d);if(b.length==a.length)return b;break}}return b}};gameData.RACES={human:0};gameData.RESOURCES={wood:0,gold:1,stone:2};gameData.ELEMENTS[gameData.FAMILIES.unit].push([{name:"builder",r:0,t:0,c:"#00f",shape:[[1]],speed:1,isBuilder:!0,buttons:[{id:0,c:"#aaa",isEnabled:!0}],timeConstruction:5,l:20,attackSpeed:3,attack:5,defense:0,weaponType:0,armorType:0,gatheringSpeed:2,maxGathering:20,pop:1,needs:[{t:gameData.RESOURCES.gold,value:20}]},{name:"swordsman",r:0,t:1,c:"#aaa",shape:[[1]],speed:1,isBuilder:!1,buttons:[],timeConstruction:10,l:50,attackSpeed:2,attack:10,defense:2,weaponType:0,armorType:0,pop:1,needs:[{t:gameData.RESOURCES.gold,
value:50}]},{name:"knight",r:0,t:2,c:"#ccc",shape:[[1,1],[1,1]],speed:2,isBuilder:!1,buttons:[],timeConstruction:20,l:120,attackSpeed:1,attack:20,defense:5,weaponType:0,armorType:0,pop:2,needs:[{t:gameData.RESOURCES.gold,value:100}]}]);gameData.ELEMENTS[gameData.FAMILIES.building].push([{name:"townhall",r:0,t:0,shape:[[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]],timeConstruction:60,constructionColors:["#000","#555","#888","#ccc"],buttons:[gameData.ELEMENTS[gameData.FAMILIES.unit][gameData.RACES.human][0]],needs:[{t:gameData.RESOURCES.wood,value:100},{t:gameData.RESOURCES.stone,value:100}],l:500,defense:3,armorType:1,pop:8},{name:"house",r:0,t:1,shape:[[1,1,1],[1,1,1],[1,1,1]],timeConstruction:20,constructionColors:["#000","#555","#888",
"#ccc"],buttons:[],needs:[{t:gameData.RESOURCES.wood,value:50}],l:100,defense:1,armorType:1,pop:5},{name:"casern",r:0,t:2,shape:[[1,1,1,1],[1,1,1,1],[1,1,1,1],[0,1,1,0]],timeConstruction:40,constructionColors:["#000","#555","#888","#ccc"],buttons:[gameData.ELEMENTS[gameData.FAMILIES.unit][gameData.RACES.human][1],gameData.ELEMENTS[gameData.FAMILIES.unit][gameData.RACES.human][2]],needs:[{t:gameData.RESOURCES.wood,value:100},{t:gameData.RESOURCES.stone,value:50}],l:250,defense:2,armorType:1}]);gameData.BASECAMPS=[{buildings:[gameData.ELEMENTS[gameData.FAMILIES.building][gameData.RACES.human][0]],units:[gameData.ELEMENTS[gameData.FAMILIES.unit][gameData.RACES.human][0],gameData.ELEMENTS[gameData.FAMILIES.unit][gameData.RACES.human][0],gameData.ELEMENTS[gameData.FAMILIES.unit][gameData.RACES.human][0]]}];gameData.MAP_TYPES={standard:{id:0,name:"Standard"},random:{id:1,name:"Random"}};
gameData.INITIAL_RESOURCES={low:{name:"Low",re:[{t:gameData.RESOURCES.wood,value:50},{t:gameData.RESOURCES.gold,value:50},{t:gameData.RESOURCES.stone,value:30}]},standard:{name:"Standard",re:[{t:gameData.RESOURCES.wood,value:100},{t:gameData.RESOURCES.gold,value:100},{t:gameData.RESOURCES.stone,value:80}]},high:{name:"High",re:[{t:gameData.RESOURCES.wood,value:250},{t:gameData.RESOURCES.gold,value:250},{t:gameData.RESOURCES.stone,value:100}]}};
gameData.MAP_SIZES={small:{name:"Small",x:80,y:80},medium:{name:"Medium",x:140,y:140},large:{name:"Large",x:200,y:200}};gameData.ZONES={nothing:0,basecamp:1,forest:2,goldmine:3,stonemine:4,water:5};gameData.VEGETATION_TYPES={standard:{name:"Standard",zones:[{t:gameData.ZONES.nothing,factor:20},{t:gameData.ZONES.forest,factor:12},{t:gameData.ZONES.goldmine,factor:1},{t:gameData.ZONES.stonemine,factor:2}]}};gameData.ELEMENTS[gameData.FAMILIES.terrain].push([{name:"tree",t:0,c:"#0f0",shape:[[1]],canMoveIn:!1,resourceType:gameData.RESOURCES.wood,ra:75},{name:"stone",t:1,c:"#000",shape:[[1,1,1],[1,1,1],[1,1,1]],canMoveIn:!1,resourceType:gameData.RESOURCES.stone,ra:500},{name:"gold",t:2,c:"#fc1",shape:[[1,1,1],[1,1,1],[1,1,1]],canMoveIn:!1,resourceType:gameData.RESOURCES.gold,ra:3E3}]);gameData.Building=function(a,b,c,d,e){this.id=gameData.createUniqueId();this.f=gameData.FAMILIES.building;this.t=a.t;this.o=d;this.r=a.r;this.p={x:b,y:c};this.c=e?a.constructionColors[a.constructionColors.length-1]:a.constructionColors[0];this.cp=e?100:0;this.rp=null;this.q=[];this.qp=0;this.l=a.l};gameData.Map=function(a,b,c,d){this.t=a;this.size=b;this.ve=c;this.ir=d};gameData.Player=function(a,b,c){this.pid=a;this.o=b;this.r=c;this.re=[];this.ra=[];this.tec=[];this.pop={max:0,current:0};for(var d in gameData.BASECAMPS[this.r].buildings)a=gameData.BASECAMPS[this.r].buildings[d],0<a.pop&&(this.pop.max+=a.pop);for(d in gameData.BASECAMPS[this.r].units)a=gameData.BASECAMPS[this.r].units[d],0<a.pop&&(this.pop.current+=a.pop)};gameData.Terrain=function(a,b,c){this.f=gameData.FAMILIES.terrain;this.t=a.t;this.r=0;this.p={x:b,y:c};this.ra=a.ra};gameData.Unit=function(a,b,c,d){this.id=gameData.createUniqueId();this.f=gameData.FAMILIES.unit;this.t=a.t;this.r=a.r;this.o=d;this.p={x:b,y:c};this.mt={x:null,y:null};this.a=null;this.fr=0;this.pa=this.ga=null;this.l=a.l};var mapLogic={ZONES_NUMBER:10,PROBABILITY_TREE:0.6,createNewMap:function(a,b){this.initGrid(a.size);a.t.id==gameData.MAP_TYPES.random.id&&this.createRandomMap(a,b)},initGrid:function(a){gameLogic.grid=[];for(var b=0;b<a.x;b++){gameLogic.grid[b]=[];for(var c=0;c<a.y;c++)gameLogic.grid[b][c]={x:b,y:c,isWall:!1}}},createRandomMap:function(a,b){for(var c=parseInt(a.size.x/this.ZONES_NUMBER),d=parseInt(a.size.y/this.ZONES_NUMBER),e=[],f=0;f<this.ZONES_NUMBER;f++){e.push([]);for(var g=0;g<this.ZONES_NUMBER;g++)e[f].push(-10)}this.dispatchPlayers(e,
b,c,d);var h=[];for(f in a.ve.zones)for(var g=a.ve.zones[f],k=0;k<g.factor;k++)h.push(g.t);for(f=0;f<this.ZONES_NUMBER;f++)for(g=0;g<this.ZONES_NUMBER;g++)0>e[f][g]?this.populateZone({x:f*c+1,y:g*d+1},{x:(f+1)*c-1,y:(g+1)*d-1},h[parseInt(Math.random()*h.length)]):this.populateZone({x:f*c+1,y:g*d+1},{x:(f+1)*c-1,y:(g+1)*d-1},e[f][g])},populateZone:function(a,b,c){switch(c){case gameData.ZONES.forest:this.createForest(a,b);break;case gameData.ZONES.stonemine:this.createStoneMine(a,b);break;case gameData.ZONES.goldmine:this.createGoldMine(a,
b)}},createForest:function(a,b){for(var c=a.x;c<b.x;c++)for(var d=a.y;d<b.y;d++)Math.random()<this.PROBABILITY_TREE&&this.addGameElement(new gameData.Terrain(gameData.ELEMENTS[gameData.FAMILIES.terrain][0][0],c,d))},createStoneMine:function(a,b){for(var c=a.x;c<b.x;c++)for(var d=a.y;d<b.y;d++)if(0.1>Math.random()){this.addGameElement(new gameData.Terrain(gameData.ELEMENTS[gameData.FAMILIES.terrain][0][1],c,d));return}},createGoldMine:function(a,b){for(var c=a.x;c<b.x;c++)for(var d=a.y;d<b.y;d++)if(0.1>
Math.random()){this.addGameElement(new gameData.Terrain(gameData.ELEMENTS[gameData.FAMILIES.terrain][0][2],c,d));return}},addGameElement:function(a){var b=gameData.ELEMENTS[a.f][a.r][a.t].shape;gameLogic.gameElements.push(a);for(var c in b){var d=b[c],e;for(e in d)if(0<d[e]){var f=tools.getPartPosition(a,c,e);gameLogic.grid[f.x][f.y].isWall=!0}}},removeGameElement:function(a){var b=gameData.ELEMENTS[a.f][a.r][a.t].shape,c;for(c in b){var d=b[c],e;for(e in d)if(0<d[e]){var f=tools.getPartPosition(a,
c,e);gameLogic.grid[f.x][f.y].isWall=!1}}},dispatchPlayers:function(a,b,c,d){var e=this.getAvailableInitialPositions(b.length),f;for(f in b){var g=parseInt(e.length*Math.random()),h=e[g],h={x:this.convertCoordinates(a[0].length,h.x),y:this.convertCoordinates(a.length,h.y)};e.splice(g,1);a[h.x][h.y]=gameData.ZONES.basecamp;g={x:h.x*c+parseInt(c/4)+parseInt(Math.random()*c/2),y:h.y*d+parseInt(d/4)+parseInt(Math.random()*d/2)};this.setupBasecamp(b[f],g);this.placeZoneRandomlyAround(gameData.ZONES.forest,
a,h.x,h.y);this.placeZoneRandomlyAround(gameData.ZONES.goldmine,a,h.x,h.y)}},placeZoneRandomlyAround:function(a,b,c,d){for(var e=null,f=null;null==e||1==b[e][f];)e=Math.min(b[0].length-1,Math.max(0,parseInt(c+2*Math.random()-1))),f=Math.min(b.length-1,Math.max(0,parseInt(d+2*Math.random()-1)));b[e][f]=a},setupBasecamp:function(a,b){var c=gameData.BASECAMPS[a.r],d=new gameData.Building(c.buildings[0],b.x,b.y,a.o,!0);this.addGameElement(d);var d=tools.getTilesAroundElements(d),e;for(e in c.units)this.addGameElement(new gameData.Unit(c.units[e],
d[e].x,d[e].y,a.o))},getAvailableInitialPositions:function(a){var b=[];if(4!=a)for(var c=[[0,0,0],[0,1,0],[0,0,0]],d=0;d<a;d++){for(var e=null,f=null;null==e||0<c[e][f];)e=parseInt(3*Math.random()),f=parseInt(3*Math.random());c[e][f]=1;b.push({x:e,y:f});3>=a&&(2>e&&(c[e+1][f]=1),0<e&&(c[e-1][f]=1),2>f&&(c[e][f+1]=1),0<f&&(c[e][f-1]=1))}else 0.5>Math.random()?(b.push({x:0,y:0}),b.push({x:0,y:2}),b.push({x:2,y:0}),b.push({x:2,y:2})):(b.push({x:1,y:0}),b.push({x:1,y:2}),b.push({x:0,y:1}),b.push({x:2,
y:1}));return b},convertCoordinates:function(a,b){return 0==b?1:1==b?parseInt(a/2):a-2}};mapLogic.getNearestResource=function(a,b){var c=-1,d=null,e;for(e in gameLogic.gameElements){var f=gameLogic.gameElements[e];if(f.f==gameData.FAMILIES.terrain&&gameData.ELEMENTS[f.f][f.r][f.t].resourceType==b){var g=tools.getElementsDistance(a,f);if(2>g)return f;if(g<c||-1==c)c=g,d=f}}return d};
mapLogic.getNearestBuilding=function(a,b){var c=-1,d=null,e;for(e in gameLogic.gameElements){var f=gameLogic.gameElements[e];if(f.f==gameData.FAMILIES.building&&rank.isAlly(a.o,f)&&f.t==b){var g=tools.getElementsDistance(a,f);if(2>g)return f;if(g<c||-1==c)c=g,d=f}}return d};