import React, { Component } from 'react'
import './style.css'
import Square from '../Square'

export default class Board extends Component {

	constructor(props){
		super(props)
		this.state = {
			s: [0,0,0,0,0,0,0,0,0],
			playerTurn: false,
			playerFirst: false,
		}

		
		this.lines = [
			[0,3,6],
			[1,4,7],
			[2,5,8],
			[0,1,2],
			[3,4,5],
			[6,7,8],
			[0,4,8],
			[2,4,6],
		]
		this.linesWithIndexes = [
			[0,3,6],
			[1,3],
			[2,3,7],
			[0,4],
			[1,4],
			[2,4],
			[0,5,7],
			[1,5]
			[2,5,6]
		]
	}

	componentWillMount(){
		this.startGame()
	}

	startGame(){
		console.log('starting game')
		//reset the board
		this.setState({
			s: [0,0,0,0,0,0,0,0,0],
			isDefence:false,
			playerFirst: !this.state.playerFirst,
			playerTurn: !this.state.playerFirst
		}, () => {
			// if it is the computer's turn then take first move
			if (!this.state.playerTurn) this.computerTurn()
		})
	}

	


	onClick(index){
		//if it is the player's turn and the square they clicked on is empty
		if (this.state.playerTurn && this.state.s[index] === 0){
			//if the player goes first and goes in the corner, play a defensive game.
			let isDefence = this.state.s.indexOf(1) < 0 && (index === 0 || index === 2 || index === 6 || index === 8)
			//fill in square for player

			this.state.s[index] = 2
			let obj = {s: this.state.s, playerTurn: false}
			if (isDefence) obj.isDefence = true
			this.setState(obj, () => {
				if (this.checkLines(2).indexOf(3) > -1){
					console.log(this.lines, this.checkLines(2).indexOf(3), this.lines[this.checkLines(2).indexOf(3)])
					this.onWin(this.checkLines(2).indexOf(3))
					return
				}
				setTimeout(() => {
					
					if (this.state.s.indexOf(0) < 0){
						console.log('should be the end')
						this.startGame()
					} else {
						this.computerTurn()
					}
				}, 1000)
			})
		}
	}

	onWin(line){
		console.log('on win', line)
		line = line.length > 1 ? line[0] : line
		console.log('on win after adjustment', line)
		this.st(this.lines[line][0],300)
		this.st(this.lines[line][1],600)
		this.st(this.lines[line][2],900)
		this.st(null,1200)
		setTimeout(() => {
			this.startGame()
		},2000)
	}

	st(index, delay){
		
		setTimeout(() => {
			this.setState({isWinner: index})
		},delay)
	}

	checkLines(mark, altSquares){
		let squares = altSquares ? altSquares : this.state.s
		console.log('checking lines', altSquares)
		let lines= [];
		for (var i = 0 ; i < this.lines.length; i++){
			let count = 0;
			for (var j = 0; j < this.lines[i].length; j++){
				if (squares[this.lines[i][j]] == mark){	
					count += 1
				} 
			}
			lines.push(count)
		}
		return lines
	}



	computerTurn(){
		let self = this;
		function checkIfRandomMove(){
			let r = Math.random() 
			
			if (r > self.props.skill) return true
			return false
		}	

		function takeRandomMove(){
			return new Promise((resolve, reject) => {
				let possibleIndexes = []
				for (var i = 0; i < self.state.s.length; i++){
					if (self.state.s[i] === 0) possibleIndexes.push(i)
				}
				let index = possibleIndexes[Math.floor(Math.random() * possibleIndexes.length)]
				
				var newSquares = []
				for (var i = 0; i < self.state.s.length; i++){
					newSquares.push(self.state.s[i])
				}

				newSquares[index] = 1

					let winningLine =self.checkLines(1, newSquares)
					if (winningLine.indexOf(3) > -1){
						console.log('random move has won it')
						resolve({index: index, hasWon: winningLine.indexOf(3)})
					} else {
						resolve({index: index, hasWon: false})
					}
		
			})
			
			
			
			
			
		}

		
		function takeTurn(index, turnDefenceOff, hasWon){
			//this handles difficulty.  
			
			console.log('has won in take turn', hasWon)
			let newSquares = self.state.s
			newSquares[index] = 1
			let obj = {s: newSquares, playerTurn: true}
			if (turnDefenceOff) obj.isDefence = false
			self.setState(obj, () => {
				
				if (hasWon  || hasWon === 0){
					return self.onWin(hasWon)
				} else if (self.state.s.indexOf(0) < 0) setTimeout(() => {self.startGame()},300)
			})
		}

		function getAllIndexes(arr, val) {
		    var indexes = [], i = -1;
		    while ((i = arr.indexOf(val, i+1)) != -1) indexes.push(i);
		    return indexes;
		}

		function goNextToUser(){
			function getIndex(){
				let user = self.state.s.indexOf(2)
				for (var i = 0; i < self.lines.length; i++){
					let index = self.lines[i].indexOf(user)
					if (index > -1){
						let rowIndex = index === 1 ? 2 : 1
						return self.lines[i][rowIndex]
					}
				}
			}
			takeTurn(getIndex(), true)	
		}

		

		function goInACorner(justChecking){
			let index = self.state.s[8] === 0 ? 8 : self.state.s[6] === 0 ? 6 : self.state.s[2] === 0 ? 2 : self.state.s[0] === 0 ? 0 : false
			if ((index || index === 0)&& !justChecking) takeTurn(index)
			else if (index  || index === 0) return true
			else return false
		}

		function findSquareInLine(lineIndexes, testWin){
			for(var j = 0; j < lineIndexes.length; j++){
				for (var i = 0; i < self.lines[lineIndexes[j]].length; i++){
					let square = self.state.s[self.lines[lineIndexes[j]][i]]
					if (square === 0){
						takeTurn(self.lines[lineIndexes[j]][i], true)
						return true
					}
				}
				
			}
			return testWin ? lineIndexes : false
		}

		function turn(){
			let computer = getAllIndexes(self.checkLines(1), 2)
			let player = getAllIndexes(self.checkLines(2),2)
			//take a random move if skill threshold is not met
			let isRandomMove = checkIfRandomMove()
			if (isRandomMove) {
				console.log('is random')
				takeRandomMove().then((move) => {
					takeTurn(move.index, false, move.hasWon)
				})
				
			}

			// if the computer has 2 in a line and there is an empty square, find the square to win it.
			else if(computer.length > 0 && findSquareInLine(computer)) {
				console.log('won on strategy')
				self.onWin(findSquareInLine(getAllIndexes(self.checkLines(1), 3), true))
				
			}
			// if the opponent has 2 in a line and there is an empty square, find the square to block it.
			else if(player.length > 0 && findSquareInLine(player)){
				console.log('blocked player')
			}
			//if user went first in a corner, get them to play the middle line
			else if (self.state.isDefence && self.state.s[4] === 0){
				console.log('going in middle')
				takeTurn(4, false)
			}
			// if user went first and went in a corner
			else if (self.state.isDefence){
				console.log('should go next to em')
				goNextToUser()
			}
			
			else if (goInACorner(true)){
				console.log('going in a corner')
				goInACorner()
			} else {
				takeRandomMove().then((move) => {
					takeTurn(move.index, false, move.hasWon)
				})
			}
		}
		turn()		
	}

	render(){
		return(
			<div className="outerBoard" style={{width: this.props.size - (Math.floor((this.props.size / 100)) + 7) + 'px', height: this.props.size - (Math.floor((this.props.size / 100)) + 7) + 'px'}}>
			<div className="board" style={{width: this.props.size + 'px', height: this.props.size + 'px'}}>
				{this.state.s.map((s,i) => {
					return(
						<Square
							color={this.props.color}
							size={Math.floor(this.props.size / 3)}
							isWinningLine={i === this.state.isWinner}
							onClick={this.onClick.bind(this)}
							index={i} 
							key={i}
							content={s}
						/>
					)
				})}
			</div>
			</div>
		)
	}
}


Board.defaultProps = {
	size: 300,
  	skill: 1,
  	color:'#101010'
}