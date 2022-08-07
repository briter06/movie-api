import Joi from "joi";
import moment from "moment";

export const joiStringInteger = () => Joi.string().custom((value, helper)=>{
    const num = Number(value);
    if(!isNaN(num) && num%1===0){
        return true;
    }else{
        return helper.error('api.number.int')
    }
}).messages({
    'api.number.int': '"limit" must be an integer number'
})

export const joiDateFormat = (dateFormat: string) => Joi.string().custom((value, helper)=>{
    const date = moment(value, dateFormat, true);
    if(date.isValid()){
        return true;
    }else{
        return helper.error('date.invalid');
    }
}).messages({
    'date.invalid': '"release_date" must be a valid date in YYYY-MM-DD format'
})

export const joiEmail = () => Joi.string().email({ tlds: { allow: false } }).label('email');

export const joiPassword = () => Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#?\]]).{10,}$/).label('password');