import React, { Component } from 'react';
import GridCol from 'arui-feather/grid-col';
import GridRow from 'arui-feather/grid-row';
import Heading from 'arui-feather/heading';
import Input from 'arui-feather/input';
import Button from 'arui-feather/button';
import CardСhip from '../credit-card-chip.svg';
import Mir from '../svg/mir-logo.svg'
import MasterCard from '../svg/Mastercard-logo.svg'
import VisaLogo from '../svg/visa_logo.svg'
import RadioGroup from 'arui-feather/radio-group';
import Radio from 'arui-feather/radio';
import List from 'arui-feather/list';
import {Form, Alert} from 'react-bootstrap';
import MaskedFormControl from 'react-bootstrap-maskedinput'

export default class PayForm extends Component {
	
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	error:"",
	  	paySystem: "",
	  	money: '',
	  	cvv:"",
	  	date:"",
	  	card_number: null,
	  	holder_name:"",
	  	show: false
	  };
	}

	//Хэндлер подтверждения отправки формы

	handleSubmit = (e)=>{
		e.preventDefault();
		alert("номер карты: " + this.state.card_number + " дата: " + this.state.date + " имя держателя: " + this.state.holder_name + " cvv: " +this.state.cvv)
	}

	getlength = (number) => {
    return number.toString().length;
	}

	//Хэндлер изменения инпутов

	handleChange =(e)=> {
	    this.setState({
	      [e.target.id]: e.target.value
	    });
	    if (e.target.id === "card_number") {
	    	this.setState({paySystem:this.paySystemDef(e.target.value)})
	    }
	   	if (e.target.id === "date" && parseInt(e.target.value.charAt(4))) {
	    	this.checkDate(e.target.value)
	    }
	    if (e.target.id === "holder_name"){
			let value = e.target.value
			value = value.replace(/[^A-Za-z\s]+$/ig, '').toUpperCase()
			this.setState({[e.target.id]: value
			})
	    }
	}

	//Функция проверки целостности данных

	checkData = (card_number, date, holder_name, cvv) => {
		if (card_number && date && holder_name && cvv){
			if (this.getlength(parseInt(card_number.replace(/\s/g, '')))===16 
				&& this.getlength(parseInt(date.replace(/\//g, '')))===4
				&& this.getlength(parseInt(cvv))===3){
					return true
			}
		}
	}

	//Функция проверки даты 

	checkDate = (date) => {
		let currentDate = new Date()
		let currentMonth = currentDate.getUTCMonth() + 1; //months from 1-12
		let currentYear = currentDate.getUTCFullYear().toString().substr(-2);
		if (currentYear < date.slice(3)){
			this.setState({error: ""});
			this.setState({show:false})
			} else {
			this.setState({error: "Карта более недействительна"});
			this.setState({show:true})
		}
		if (currentYear === date.slice(3)) {
			if (currentMonth <= date.slice(0, 2)){
				this.setState({error: ""});
				this.setState({show:false})
			} else {
				this.setState({error: "Карта более недействительна"});
				this.setState({show:true})
			}
		}
	}

	//Функция определения платежной системы

	paySystemDef = (value) => {
		switch (value.charAt(0)) {
			case "2": 
				return Mir
			case "4":
				return VisaLogo
			case "5":
				return MasterCard
		    default:
		      return null;

		}
	}

	//функция активации кнопки "Оплатить"

	buttonActivate = () => {
		const { show, holder_name, card_number, cvv, date} = this.state
		if (this.checkData(card_number, date, holder_name, cvv)){
			if(!show){
				return true
			}
		}
	}

	handleMoneyChange = (money) => {
	    this.setState({ money });
	    console.log(this.state.money)
	}

	render() {
		const { error, show, holder_name, card_number, cvv, date, paySystem} = this.state
		const ITEMS_OL = [
		    {
		    	id:"one",
		        key: 'one',
		        value: 'Введите сумму оплаты'
		    },
		    {
		        key: 'two',
		        value: 'Введите шестнадцатизначный номер карты'
		    },
		    {
		        key: 'three',
		        value: 'Введите срок окончания действия карты'
		    },
		    {
		        key: 'four',
		        value: 'Введите имя держателя карты (латиница, заглавные буквы)'
		    },
		    {
		        key: 'five',
		        value: 'Введите cvv код на обратной стороне карты'
		    }
		];

		return (
			<div>
				<GridRow justify="center">
					<GridCol width={ { mobile: 11, tablet: 11, desktop: 6 } } className="pay-content">
						<GridRow>
							<GridCol width='12'>
								<Heading size='l'>
									Оплата банковской картой
								</Heading>
							</GridCol>
								<GridCol width='12'>
									<div className="value_input1">
									    <Input
									        size='m'
									        placeholder='Введите сумму'
									        rightAddons={
									            <RadioGroup type='button'>
									                {
									                    ['₽', '$', '€'].map(item => (
									                        <Radio
									                            key={ item }
									                            size='s'
									                            type='button'
									                            text={ item }
									                            onChange={ this.handleMoneyChange }
											                        />
											                    ))
											        }
											    </RadioGroup>
											}
											type='number'
									    />
									</div>
								</GridCol>
						</GridRow>	
						<GridRow>
							<GridCol width='12'>
								<Form onSubmit={this.handleSubmit}>
									<div className="card_box">
										<div className="card_back">
											<div className="black_line">
											</div>
											<GridRow>
												<GridCol width={ { mobile: 3, tablet: 3, desktop: 2 } } offset={ { mobile: 7, tablet: 7, desktop: 8 } }>
													<Form.Group>
													    <MaskedFormControl 
													    	mask='111'
													    	type="text" 						
													    	id="cvv"
															value={cvv}
															onChange={this.handleChange}
															placeholder={'cvv'}/>
													  </Form.Group>
												</GridCol>
											</GridRow>
								    	</div>
									<div className="card">
										<img  alt="chip" src={CardСhip} className="card-chip"></img>
										<GridRow gutter={ { desktop: { m: 0 } } }>
											<GridCol width='12'>
											  	<Form.Group>
												    <MaskedFormControl 
												    mask='1111 1111 1111 1111'
												    	type="text" 						
												    	id="card_number"
														value={card_number}
														onChange={this.handleChange}
														placeholder={'Введите номер карты'}/>
											  	</Form.Group>
																				
											</GridCol>
										</GridRow>
										<GridRow justify="left" gutter={ { desktop: { m: 0 } } }>
										    <GridCol width={ { mobile: 7, tablet: 7, desktop: 4 } }>
							       				<div className="date_label">
							                        Действительна до
							                    </div>
							                    <div className="date_label desc">
							                        (месяц/год)
							                    </div>
 											</GridCol>
								        	<GridCol width={ { mobile: 5, tablet: 5, desktop: 2 }  }>
										       <Form.Group>
												    <MaskedFormControl
												    mask="11/11"
												    	type="text" 						
												    	id="date"
														value={date}
														onChange={this.handleChange}
														placeholder={'дата'}/>
												</Form.Group>
 											</GridCol>
 										</GridRow>
			 							<GridRow justify="left" gutter={ { desktop: { m: 0 } } }>
			 								<GridCol width={ { mobile: 12, tablet: 12, desktop: 7 } }>
												<Form.Group>
												    <Form.Control
												    	type="text" 						
												    	id="holder_name"
														value={holder_name}
														onChange={this.handleChange}
														placeholder={'Имя держателя'}/>
												</Form.Group>
			 								</GridCol>
			 								<GridCol width='3' offset='2'>
			 									<img src={paySystem} className="visa_logo"></img>
			 								</GridCol>
			 							</GridRow>
								    </div>
								</div>
									<Button disabled={!this.buttonActivate()} view='extra' type='submit' className="subm-btn">Оплатить
									</Button>
								</Form>
							</GridCol>
							<GridCol width ={ { mobile: 11, tablet: 11, desktop: 6 } } >
								<div show={show} className="error">
									{error ? error:null}
								</div>
							</GridCol>
						</GridRow>
					</GridCol>
					<GridCol width={ { mobile: 11, tablet: 11, desktop: 6 } } className="description">
						<Heading size='l'>
							Описание способа оплаты
						</Heading>
						<List
						    items={ ITEMS_OL }
						    type='ordered'
						    id="1"
						/>
					</GridCol>
				</GridRow>
			</div>
		);
	}
}
