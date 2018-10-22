import React, { Component } from 'react'
import './style.css'

export default class Square extends Component {

	constructor(props){
		super(props)
		this.state = {
			content: 0
		}
	}

	onClick(){
		this.props.onClick(this.props.index)
	}

	componentWillReceiveProps(np){
		if (this.props.content === 0 && np.content === 1){
			this.setState({content: 1})	
		}
		else if (this.props.content === 0 && np.content === 2){
			this.setState({content: 2})	
		} else if (this.props.content !== 0 && np.content === 0){
			this.setState({content:0})
		} 
	}

	render(){
		return(
			<div className="square" onClick={this.onClick.bind(this)} style={{borderColor: this.props.color}}>
					<div className={this.props.isWinningLine ? "svgContainer1 winner" : 'svgContainer1'}>
						<svg height={this.props.size } width={this.props.size }>
						  <circle className={this.state.content === 1 ? 'filled path' : 'path'}cx={this.props.size /2} cy={this.props.size /2} r={this.props.size /4} stroke={this.props.color} strokeWidth="4" fill="transparent" />
						</svg>
					</div>
					<div className={this.props.isWinningLine ? "svgContainer2 winner" : 'svgContainer2'}>
						<svg height={this.props.size /2} width={this.props.size /2}>
						    <line className={this.state.content === 2 ? 'filled path' : 'path'}x1="0" y1="0" x2={this.props.size /2} y2={this.props.size /2} strokeWidth="4" stroke={this.props.color}/>
						 	<line className={this.state.content === 2 ? 'filled path2' : 'path2'}x1={this.props.size /2} y1="0" x2="0" y2={this.props.size /2} strokeWidth="4" stroke={this.props.color}/>
						</svg>
					</div>
			</div>
		)
	}
}