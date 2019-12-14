import React from 'react';
import { View, Button, TextInput, StyleSheet, FlatList } from 'react-native';
import films from '../helpers/filmsData';
import FilmItem from './FilmItem';
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi';

class Search extends React.Component {

    constructor(props) {
        super(props);

        this._films = [];
    }

    _loadFilms() {
        getFilmsFromApiWithSearchedText("star")
            .then(data => {
                this._films = data.results;
                this.forceUpdate();
            });
    }

    render() {
        return (
            <View style={ styles.mainContainer }>
                <TextInput style={ styles.textInput } placeholder="Titre du film"/> 
                <Button title="Rechercher" onPress={() => this._loadFilms()}/>
                <FlatList
                    data={this._films}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <FilmItem film={item}/>}
                />
            </View>
        )
    }

}
const styles = StyleSheet.create ({
    mainContainer: {
        marginTop: 50,
        flex: 1
    },
    textInput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5       
    }
});

export default Search