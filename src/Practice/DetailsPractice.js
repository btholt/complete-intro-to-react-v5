import React from 'react';
import pet from "@frontendmasters/pet";
import CarouselPrac from "./CarouselPractice";

class DetailsPrac extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            loading: true
        };
    }

    componentDidMount () {
        //this.props from parents
        pet.animal(this.props.id)
            .then(({animal}) => {
                this.setState({
                    name: animal.name,
                    animal: animal.type,
                    location: `${animal.contact.address.city}, ${animal.contact.address.state}`,
                    description: animal.description,
                    media: animal.photos,
                    breed: animal.breeds.primary,
                    loading: false
                });
            }, console.error);
    }
    render () {
        //hooks do not work with classes
        if (this.state.loading) {
            return <h1>loading...</h1>
        }

        const { animal, breed, location, description, name } = this.state;


        return (
            <div className="deets">
                <CarouselPrac media={media} />
                <div>
                    <h1>{name}</h1>
                    <h2>{`${animal} - ${breed} - ${location}`}</h2>
                    <button>Adopt {name}</button>
                    <p>{description}</p>
                </div>
            </div>
        );
    }
}


export default DetailsPrac;
