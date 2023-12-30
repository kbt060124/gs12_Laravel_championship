import AppLayout from '@/components/Layouts/AppLayout'
import Banner from '@/components/Banner'
import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import {
    Box,
    CardActionArea,
    CardMedia,
    Container,
    Typography,
} from '@mui/material'
import Link from 'next/link'

const Home = () => {
    const [popularMovies, setPopularMovies] = useState([])
    const [ratedMovies, setRatedMovies] = useState([])
    const [nowMovies, setNowMovies] = useState([])
    const [upcomingmovies, setUpcomingmovies] = useState([])

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const [
                    popularResponse,
                    ratedResponse,
                    nowResponse,
                    upcomingResponse,
                ] = await Promise.all([
                    axios.get('api/getPopularMovies'),
                    axios.get('api/getRatedMovies'),
                    axios.get('api/getNowMovies'),
                    axios.get('api/getUpcomingMovies'),
                ])

                setPopularMovies(popularResponse.data.results)
                setRatedMovies(ratedResponse.data.results)
                setNowMovies(nowResponse.data.results)
                setUpcomingmovies(upcomingResponse.data.results)
            } catch (error) {
                console.log(error)
            }
        }
        fetchMovies()
    }, [])


    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Home
                </h2>
            }>
            <Head>
                <title>Laravel - home</title>
            </Head>

            <Banner />

            <Container>
                <Box marginY={10}>
                    <Typography marginY={2} variant="h4">
                        Ranking
                    </Typography>
                    <Swiper
                        spaceBetween={30}
                        slidesPerView={5}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={swiper => console.log(swiper)}
                        breakpoints={{}}>
                        {popularMovies.map((movie, index) => (
                            <SwiperSlide key={movie.id}>
                                <Link href={`detail/movie/${movie.id}`}>
                                    <Box display="flex">
                                        <Box
                                            display="flex"
                                            alignItems="flex-end">
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    marginY={2}
                                                    variant="h4"
                                                    style={{
                                                        textShadow:
                                                            '1px 1px 0 white, -1px -1px 0 white, -1px 1px 0 white, 1px -1px 0 white, 0px 1px 0 white,  0-1px 0 white, -1px 0 0 white, 1px 0 0 white',
                                                        color:
                                                            'rgb(243 244 246)',
                                                    }}>
                                                    　　
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    marginY={2}
                                                    variant="h2"
                                                    style={{
                                                        textShadow:
                                                            '1px 1px 0 white, -1px -1px 0 white, -1px 1px 0 white, 1px -1px 0 white, 0px 1px 0 white,  0-1px 0 white, -1px 0 0 white, 1px 0 0 white',
                                                        color:
                                                            'black',
                                                    }}>
                                                    {index + 1}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box gridColumn="span 9">
                                            <CardActionArea>
                                                <CardMedia
                                                    component={'img'}
                                                    sx={{
                                                        aspectRatio: '2/3',
                                                    }}
                                                    image={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                                                    alt={movie.title}
                                                />
                                            </CardActionArea>
                                        </Box>
                                    </Box>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>

                <Box marginBottom={10}>
                    <Typography marginY={2} variant="h4">
                        Rated
                    </Typography>
                    <Swiper
                        spaceBetween={30}
                        slidesPerView={5}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={swiper => console.log(swiper)}
                        breakpoints={{}}>
                        {ratedMovies.map(movie => (
                            <SwiperSlide key={movie.id}>
                                <Link href={`detail/movie/${movie.id}`}>
                                    <CardActionArea>
                                        <CardMedia
                                            component={'img'}
                                            sx={{
                                                aspectRatio: '2/3',
                                            }}
                                            image={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                                            alt={movie.title}
                                        />
                                    </CardActionArea>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>

                <Box marginBottom={10}>
                    <Typography marginY={2} variant="h4">
                        Now Playing
                    </Typography>
                    <Swiper
                        spaceBetween={30}
                        slidesPerView={5}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={swiper => console.log(swiper)}
                        breakpoints={{}}>
                        {nowMovies.map(movie => (
                            <SwiperSlide key={movie.id}>
                                <Link href={`detail/movie/${movie.id}`}>
                                    <CardActionArea>
                                        <CardMedia
                                            component={'img'}
                                            sx={{
                                                aspectRatio: '2/3',
                                            }}
                                            image={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                                            alt={movie.title}
                                        />
                                    </CardActionArea>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>

                <Box paddingBottom={10}>
                    <Typography marginY={2} variant="h4">
                        Upcoming
                    </Typography>
                    <Swiper
                        spaceBetween={30}
                        slidesPerView={5}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={swiper => console.log(swiper)}
                        breakpoints={{}}>
                        {upcomingmovies.map(movie => (
                            <SwiperSlide key={movie.id}>
                                <Link href={`detail/movie/${movie.id}`}>
                                    <CardActionArea>
                                        <CardMedia
                                            component={'img'}
                                            sx={{
                                                aspectRatio: '2/3',
                                            }}
                                            image={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                                            alt={movie.title}
                                        />
                                    </CardActionArea>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Container>
        </AppLayout>
    )
}

export default Home
