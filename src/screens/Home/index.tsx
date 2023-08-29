import { View, Text, TextInput, FlatList, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import { MagnifyingGlass } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { CardMovies } from "../../components/CardMovies";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
}


export function Home(){
    const [discoveryMovies, setDiscoveryMovies] = useState<Movie[]>([]);
    const [searchResultMovies, setSearchResultMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [noResult, setNoResult] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadMoreData();
    }, []);

    const loadMoreData = async () => {
        setLoading(true);
        const respose = await api.get('/movie/popular', {
            params: {
                page: page,
            }
        });
        setDiscoveryMovies([...discoveryMovies ,...respose.data.results]);
        setPage(page + 1);
        setLoading(false);
    };

    const searchMovies = async (query: string) => {
        setLoading(true);
        const respose = await api.get('/search/movie', {
            params: {
                query: query,
            }
        });

        if(respose.data.results.length == 0){
            setNoResult(true);
        } else {
            setSearchResultMovies(respose.data.results);
        }
        setLoading(false);
    };

    const handleSearch = (text: string) => {
        setSearch(text);
        if(text.length > 2){
            searchMovies(text);
        } else {
            setSearchResultMovies([]);
        }
    };


    const movieData = search.length > 2 ? searchResultMovies : discoveryMovies;

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Oque você quer assistir hoje?</Text>
                <View style={styles.containerInput}>
                    <TextInput
                        placeholderTextColor="#fff"
                        placeholder="Buscar"
                        style={styles.input}
                        value={search}
                        onChangeText={handleSearch}
                        />
                    <MagnifyingGlass color="#fff" size={25} weight="light" />
                </View>
            </View>
            <View>
                <FlatList
                    data={movieData}
                    numColumns={3}
                    renderItem={(item) => <CardMovies data={ item.item } />}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={{
                        paddingLeft: 45,
                        paddingBottom: 250,
                    }}
                    onEndReached={() => loadMoreData()}
                    onEndReachedThreshold={0.5}
                />
                {loading && <ActivityIndicator size={50} color={"#02966e5"}/>}
            </View>
        </View>
    );
}