import React, { Component } from 'react'
import {Formik, Field, Form} from 'formik';
import Table from 'react-bootstrap/Table'
import * as Yup from 'yup';

const formSchema = Yup.object().shape({
    "pokemon": Yup.string().typeError('You must enter a valid Pokemon').required("Required")
})
const initialValues = {
    pokemon: ''
}

export default class Home extends Component {

    constructor() {
        super();
        this.state={
            pokeName:[],
            badName:false
        };
    }

    handleSubmit=({pokemon})=>{
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
            .then(res=>res.json())
            .then(data=>{
                this.setState({
                    pokeName:data,
                    badName: false
                }, ()=>console.log(this.state.pokeName))
            })
            .catch(error=>{console.error(error); this.setState({badName:true})})
    }    

    render() {
        return (
            <div>
                <h1>Pokemon Search</h1>
                {this.state.badName ? <small style={{color:"red"}}>Invalid Pokemon</small>:""}
                <Formik initialValues={initialValues}
                        validationSchema={formSchema}
                        onSubmit={
                            (values, {resetForm})=>{
                                this.handleSubmit(values);
                                resetForm(initialValues);
                            }
                        }
                        >
                        {
                            ({errors, touched})=>(
                                <Form>
                                    <label htmlFor="pokemon" className="form-label">Pokemon Name</label>
                                    <Field name="pokemon" className="form-control" />
                                    {errors.pokemon && touched.pokemon ? (<div style={{color:'red'}}>{errors.pokemon}</div>):null}
                    
                                    <button type="submit" className="btn btn-primary">Search</button>

                                </Form>
                            )
                        }

                </Formik>

                
                {this.state.pokeName?.length > 0  ?
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Name</th>
                            <th>Ablility</th>
                            <th>Image</th>
                            <th>Base Experience</th>
                            <th>Attack</th>
                            <th>Defence</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.pokeName.map(
                            poke => (
                            <tr key={poke.forms[0].name}>
                                <td>{poke.forms[0].name}</td>
                                <td>{poke.abilities[0].ability.name}</td>
                                <td>{poke.base_experience}</td>
                                <td><img src={poke.front_shiny} alt="img"></img></td>
                                <td>{poke.stats[1].base_stat}</td>
                                <td>{poke.stats[2].base_stat}</td>
                            </tr>
                            )
                        )
                        }
                        </tbody>
                    </Table>
                :''}

            </div>
        )
    }
}