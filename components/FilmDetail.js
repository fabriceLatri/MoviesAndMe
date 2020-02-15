import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Image, Share, Platform } from 'react-native';
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux';

class FilmDetail extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state

        if (params.film != undefined && Platform.OS === 'ios') {
            if (params.toggleTheme === 'dark') { 
                return {
                    headerStyle: {
                        backgroundColor: '#333'
                    },
                    headerRight: 
                        <TouchableOpacity
                            style={styles.share_touchable_headerrightbutton}
                            onPress={() => params.shareFilm()}>
                                <Image
                                    style={styles.share_image}
                                    source={require('../images/ic_share.ios.png')} 
                                />
                        </TouchableOpacity>
                }
            } else {
                return {
                    headerRight: 
                        <TouchableOpacity
                            style={styles.share_touchable_headerrightbutton}
                            onPress={() => params.shareFilm()}>
                                <Image
                                    style={styles.share_image}
                                    source={require('../images/ic_share.ios.png')} 
                                />
                        </TouchableOpacity>
                }
            }
            
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            film: undefined,
            isLoading: false
        };
        this._shareFilm = this._shareFilm.bind(this);
    }

    _updateNavigationParams() {
        this.props.navigation.setParams({
            shareFilm: this._shareFilm,
            film: this.state.film
        })
    }

    componentDidMount() {
        this.props.navigation.setParams({ toggleTheme: this.props.toggleTheme })
        const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
        if (favoriteFilmIndex !== -1) {
            this.setState({
                film: this.props.favoritesFilm[favoriteFilmIndex]
            })
            return;
        }
        this.setState({ isLoading: true })
        getFilmDetailFromApi(this.props.navigation.state.params.idFilm)
            .then(data => {
                this.setState({
                    film: data,
                    isLoading: false
                }, () => {this._updateNavigationParams() });
                return; 
            });
    }

    // componentDidUpdate() {
        // console.log('componentDidUpdate: ');
        // console.log(this.props.favoritesFilm);
    // }

    _shareFilm() {
        const { film } = this.state;
        Share.share({ title: film.title, message: film.overview });
    }

    _displayFloatingActionButton() {
        const { film } = this.state
        if (film != undefined && Platform.OS === 'android') {
            return (
                <TouchableOpacity
                    style={styles.share_touchable_floatingactionbutton}
                    onPress={() => this._shareFilm()}>
                        <Image
                            style={styles.share_image}
                            source={require('../images/ic_share.android.png')} 
                        />
                </TouchableOpacity>
            )
        }
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    _toggleFavorite() {
        const action = { type: "TOGGLE_FAVORITE", value: this.state.film };
        this.props.dispatch(action);
    }

    _displayFavoriteImage() {
        var sourceImage = require('../images/ic_favorite_border.png');
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
            sourceImage = require('../images/ic_favorite.png');
        }
        return (
            <Image
                style={styles.favorite_image}
                source={sourceImage}
            />
        )
    }


    _displayFilm() {
        const { film } = this.state;
        if (film !== undefined) {
            return (
                <ScrollView style={styles.scrollview_container}>
                    <Image  
                        style={styles.image} 
                        source={{uri: getImageFromApi(film.backdrop_path)}}
                    />
                    <Text style={styles.title_text}>{film.title}</Text>
                    <TouchableOpacity 
                        style={styles.favorite_container}
                        onPress={() => this._toggleFavorite()}>
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <Text style={styles.description_text}>{film.overview}</Text>
                    <Text style={styles.default_text}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.default_text}>Note: {film.vote_average}</Text>
                    <Text style={styles.default_text}>Nombre de note : {film.vote_count}</Text>
                    <Text style={styles.default_text}>Budget : {numeral(film.budget).format('0,0[.]00 $')}</Text>
                    <Text style={styles.default_text}>Genre(s): {film.genres.map(function(genre) {return genre.name;}).join(" / ")}</Text>
                    <Text style={styles.default_text}>Compagnie(s): {film.production_companies.map(function(compagny) { return compagny.name;}).join(" / ")}</Text>
                </ScrollView>
            )
        }
    }


    render() {
        return (
            <ScrollView style={StyleSheet.main_container}>
                {this._displayFilm()} 
                {this._displayLoading()}
                {this._displayFloatingActionButton()}
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollview_container: {
        flex: 1,
    },
    image: {
        height: 169,
        margin: 5
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 35,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'center'
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15
    },
    default_text: {
        fontWeight: 'bold',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
    },
    favorite_container: {
        alignItems: 'center', // Alignement des components enfants sur l'axe secondaire, X ici
    },
    favorite_image: {
        width: 40,
        height: 40
    },
    share_touchable_floatingactionbutton: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        borderRadius: 30,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center'
    },
    share_image: {
        width: 30,
        height: 30
    },
    share_touchable_headerrightbutton: {
        marginRight: 18
    }
})

const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.toggleFavorite.favoritesFilm,
        toggleTheme: state.toggleChangeTheme.toggleTheme
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: (action) => { dispatch(action) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilmDetail)