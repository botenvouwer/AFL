var drawAnimator = function(canvasQuery, debug){
				
	this.canvas = $(canvasQuery);
	this.context = this.canvas.getContext("2d");
	this.cue = [];
	this.debugMode = debug || false;

	this.drawAnimatedLines = function(array){
		$.each(array, function(key, value){
			this.drawAnimatedLine(value);
		});
	}

	this.drawAnimatedLine = function(speed, fromx, fromy, tox, toy, color, lineWidth){
		var key = -1 + (cue.length + 1);
		cue[key] = {
			'speed': speed,
			'fromx': fromx,
			'fromy': fromy,
			'tox': tox,
			'toy': toy,
			'color': color,
			'lineWidth': lineWidth,
			'done':false,
			'bussy':false
		};
		
		if(key == 0){
			this.AnimatedLine(speed, fromx, fromy, tox, toy, color, lineWidth, key);
		}
	}

	var animateNext = function(){
		$.each(this.cue, function(key, value){
			if(!value.done && !value.bussy){
				value.bussy = true;
				this.AnimatedLine(value.speed, value.fromx, value.fromy, value.tox, value.toy, value.color, value.lineWidth, key);
				return false;
			}
		});
	}

	var AnimatedLine = function(speed, fromX, fromY, toX, toY, color, lineWidth, cueKey){
		this.context.beginPath();
		this.context.lineWidth = lineWidth || 1;
		this.context.strokeStyle = color || 'white';
		
		var addX = 0;
		var addY = 0;
		var stop = 0;
		var stepX = 1;
		var stepY = 1;
		
		var lineMode = '';
		var lineDirection = '';
		
		var betweenX = fromX - toX;
		var betweenY = fromY - toY;
		
		if(betweenX == 0 && betweenY == 0){
			console.log('can not write line X'+fromX+' Y'+fromY+' to X'+toX+' Y'+toY);
			console.log(betweenX + ' '+ betweenY);
			if(this.debugMode){
				console.log('stop');
			}
			this.cue[cueKey].done = true;
			this.animateNext();
			return;
		}
		else if(fromY == toY){
			lineMode = 'horizontal';
			addY = toY;
			
			if(betweenX > 0){
				lineDirection = 'N';
				addX = fromX + 1;
			}
			else{
				lineDirection = 'Z';
				addX = fromX - 1;
			}
			
			stop = Math.abs(betweenX);
			
		}
		else if(fromX == toX){
			lineMode = 'vertical';
			addX = toX;
			
			if(betweenY > 0){
				lineDirection = 'O';
				addY = fromY + 1;
			}
			else{
				lineDirection = 'W';
				addY = fromY - 1;
			}
			
			stop = Math.abs(betweenY);
		}
		else{
			lineMode = 'horizontalvertical';
			
			if(betweenX > 0 && betweenY > 0){
				lineDirection = 'NO';
			}
			else if(betweenX < 0 && betweenY > 0){
				lineDirection = 'ZO';
				
			}
			else if(betweenX < 0 && betweenY < 0){
				lineDirection = 'ZW';
				
			}
			else if(betweenX > 0 && betweenY < 0){
				lineDirection = 'NW';
				
			}
			
			if(betweenX == betweenY){
				stop = Math.abs(betweenX);
				addX = fromX + stepX;
				addY = fromY + stepY;
			}
			else if(betweenX > betweenY){
				stop = Math.abs(betweenX);
				stepX = Math.abs(betweenX) / Math.abs(betweenY);
				addX = fromX + stepX;
				addY = fromY + stepY;
			}
			else if(betweenX < betweenY){
				stop = Math.abs(betweenY);
				stepY = Math.abs(betweenY) / Math.abs(betweenX);
				addX = fromX + stepX;
				addY = fromY + stepY;
			}
		}
		
		context.moveTo(fromX,fromY);
		
		if(this.debugMode){
			console.log('fromx:'+fromX);
			console.log('fromy:'+fromY);
			console.log('tox:'+toX);
			console.log('toy:'+toY);
			console.log('betweenx:'+betweenX);
			console.log('stepX:'+stepX);
			console.log('betweeny:'+betweenY);
			console.log('stepY:'+stepY);
			console.log('lineMode:'+lineMode);
			console.log('lineDirection:'+lineDirection);
			console.log('lineWidth:'+lineWidth);
			console.log('color:'+color);
		}
		
		var a = 0;
		var animate = setInterval(function(){
			context.lineTo(addX, addY);
			context.stroke();
			if(a == stop){
				if(this.debugMode){
					console.log('stop');
				}	
				clearInterval(animate);
				this.cue[cueKey].done = true;
				this.animateNext();
				return;
			}
			if(this.debugMode){
				console.log('Drawing...');
			}
			a++;
			if(lineDirection == 'Z'){
				addX += stepX;
			}
			else if(lineDirection == 'N'){
				addX -= stepX;
			}
			else if(lineDirection == 'O'){
				addY -= stepY;
			}
			else if(lineDirection == 'W'){
				addY += stepY;
			}
			else if(lineDirection == 'NO'){
				addX -= stepX;
				addY -= stepY;
			}
			else if(lineDirection == 'ZO'){
				addX += stepX;
				addY -= stepY;
			}
			else if(lineDirection == 'ZW'){
				addX += stepX;
				addY += stepY;
			}
			else if(lineDirection == 'NW'){
				addX -= stepX;
				addY += stepY;
			}	
		},speed);
	}
}