import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { getImageFromApi } from '../API/TMDBApi';
import { connect } from 'react-redux';
import FadeIn from '../animations/FadeIn';

class FilmItem extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      positionLeft: new Animated.Value(Dimensions.get('window').width)
    }
  }

  componentDidMount() {
    Animated.spring(
      this.state.positionLeft,
      {
        toValue: 0
      }
    ).start()
  }

  render() {
    const { film } = this.props;
    return (
      <FadeIn>
        <TouchableOpacity style={styles.main_container}
              onPress={() => this.props.displayDetailForFilm(film.item.id)}>
            <Image
              style={styles.image}
              source={{ uri: getImageFromApi(film.item.poster_path) }}
              />
            <View style={styles.content_container}>
              <View style={styles.header_container}>
                { this.props.isFilmFavorite ? 
                  <Image 
                  style={ styles.favorite_image }
                  source={ require('../assets/ic_favorite.png') }
                  />
                  : <Text></Text>}
                  <Text style={styles.title_text}>{film.item.title}</Text>
                  <Text style={styles.vote_text}>{film.item.vote_average}</Text>
              </View>
              <View style={styles.description_container}>
                <Text style={styles.description_text} numberOfLines={6}>{film.item.overview}</Text>
              </View>
              <View style={styles.date_container}>
                <Text style={styles.date_text}>{film.item.release_date}</Text>
              </View>
            </View>
        </TouchableOpacity>
      </FadeIn>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    height: 190,
    flexDirection: 'row'
  },
  image: {
    width: 120,
    height: 180,
    margin: 5,
    backgroundColor: 'gray'
  },
  content_container: {
    flex: 1,
    margin: 5
  },
  header_container: {
    flex: 3,
    flexDirection: 'row'
  },
  title_text: {
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 5
  },
  vote_text: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#666666'
  },
  description_container: {
    flex: 7
  },
  description_text: {
      fontStyle: 'italic',
      color: '#666666'
  },
  date_container: {
      flex:1
  },
  date_text: {
      textAlign: 'right',
      fontSize: 14
  },
  favorite_image: {
    marginTop: 5,
    marginRight: 10,
    width: 20,
    height: 15
  }
})

const mapStateToProps = state => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}

export default connect(mapStateToProps)(FilmItem)