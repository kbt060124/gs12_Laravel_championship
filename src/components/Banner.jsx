import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Grid, Container, Typography } from '@mui/material'
import ReactPlayer from 'react-player'

export const Banner = () => {
    const [movie, setMovie] = useState('')
    const [trailerUrl, setTrailerUrl] = useState('')
    const [trailerFlag, setTrailerFlag] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const popularResponse = await axios.get('api/getPopularMovies')
            console.log(popularResponse.data.result)

            //apiからランダムで値を取得している
            // setMovie(popularResponse.data.results[0])
            setMovie(
                popularResponse.data.results[
                    Math.floor(Math.random() * popularResponse.data.results.length - 1)
                ],
            )
            return popularResponse
        }
        fetchData()
    }, [])

    const handleClick = async movie => {
        if (trailerUrl) {
            setTrailerUrl('')
        } else {
            let trailerurl = await axios.get(
                `api/getTrailer?movieId=${movie.id}`,
            )
            setTrailerUrl(prev => [...prev, trailerurl.data.results[0]?.key])
        }
        setTrailerFlag(true)
    }

    console.log(trailerUrl)

    return (
        <Box
            sx={{
                height: { xs: 'auto', md: '70vh' },
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
            }}>
            <Box
                sx={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdrop_path})`,
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',

                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backgroundFilter: 'blur(10px)',
                    },
                }}
            />
            <Container sx={{ zIndex: 1 }}>
                <Grid
                    container
                    sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'white',
                    }}>
                    <Grid
                        item
                        md={6}
                        sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                            onClick={() => {
                                handleClick(movie)
                            }}>
                            {trailerFlag ? (
                                <ReactPlayer
                                    url={`https://www.youtube.com/watch?v=${trailerUrl}`}
                                />
                            ) : (
                                <img
                                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                    alt=""
                                />
                            )}
                        </Box>
                    </Grid>

                    <Grid item md={5}>
                        <Typography variant="h4" paragraph>
                            {movie?.title}
                        </Typography>

                        <Typography paragraph>{movie?.overview}</Typography>

                        <Typography variant="h6">
                            {movie?.release_date}
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default Banner
