import React from 'react';
import './Header.css';

class Header extends React.Component {
	constructor(props) {
		super(props);

		this.state = {

		};
	}
	render() {
		return (
			<div className="header container">
				<img src="../../imgs/reagan.png" className="header item image"/> 
				<h1 className="header item"> rkan&apos;s (head)-ER </h1>
			</div>
		);
	}
}

export default Header;