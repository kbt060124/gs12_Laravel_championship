import AppLayout from '@/components/Layouts/AppLayout'
import laravelAxios from '@/lib/laravelAxios'
import {
    Card,
    CardContent,
    Fab,
    Grid,
    Rating,
    Tooltip,
    Typography,
    Button,
    Modal,
    TextareaAutosize,
    ButtonGroup,
    IconButton,
} from '@mui/material'
import { Box, Container } from '@mui/system'
import axios from 'axios'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import StarIcon from '@mui/icons-material/Star'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useAuth } from '@/hooks/auth'

const Detail = ({ detail, media_type, media_id }) => {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const [reviews, setReviews] = useState([])
    const [averageRating, setAverageRating] = useState(null)
    const [editMode, setEditMode] = useState(null)
    const [editedRating, setEditedRating] = useState(null)
    const [editedContent, setEditedContent] = useState('')
    const [isFavorited, setIsFavorited] = useState(false)
    const [trailerUrl, setTrailerUrl] = useState('')
    const [trailerFlag, setTrailerFlag] = useState(false)


    const { user } = useAuth({ middleware: 'auth' })

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleReviwChange = e => {
        setReview(e.target.value)
    }

    const handleRatingChange = (e, newValue) => {
        setRating(newValue)
    }

    const isButtonDisabled = (rating, content) => {
        return !rating || !content.trim()
    }

    const isReviewButtonDisabled = isButtonDisabled(rating, review)
    const isEditButtonDisabled = isButtonDisabled(editedRating, editedContent)

    const handleReviewAdd = async () => {
        handleClose()
        try {
            const response = await laravelAxios.post(`api/reviews`, {
                content: review,
                rating: rating,
                media_type: media_type,
                media_id: media_id,
            })
            console.log(response.data)
            const newReview = response.data

            setReviews([...reviews, newReview])

            setReview('')
            setRating(0)
            const updateReviews = [...reviews, newReview]
            updateAverageRating(updateReviews)
        } catch (error) {
            console.log(error)
        }
    }

    const updateAverageRating = updateReviews => {
        if (updateReviews.length > 0) {
            const totalRating = updateReviews.reduce(
                (acc, review) => acc + review.rating,
                0,
            )
            const average = (totalRating / updateReviews.length).toFixed(1)
            setAverageRating(average)
        } else {
            setAverageRating(null)
        }
    }

    const handleDelete = async id => {
        if (window.confirm('削除してよろしいですか？')) {
            try {
                const response = await laravelAxios.delete(`api/review/${id}`)
                console.log(response)
                const filteredReviews = reviews.filter(
                    review => review.id !== id,
                )
                setReviews(filteredReviews)
                updateAverageRating(filteredReviews)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleEdit = review => {
        setEditMode(review.id)
        setEditedRating(review.rating)
        setEditedContent(review.content)
    }

    const handleConfirmEdit = async reviewId => {
        try {
            const response = await laravelAxios.put(`api/review/${reviewId}`, {
                content: editedContent,
                rating: editedRating,
            })
            console.log(response)
            const updatedReview = response.data

            const updateReviews = reviews.map(review => {
                if (review.id === reviewId) {
                    return {
                        ...review,
                        content: updatedReview.content,
                        rating: updatedReview.rating,
                    }
                }
                return review
            })

            setReviews(updateReviews)

            setEditMode(null)
        } catch (error) {
            console.log(error)
        }
    }

    const handleToggleFavorite = async () => {
        try {
            const response = await laravelAxios.post(`api/favorites`, {
                media_type: media_type,
                media_id: media_id,
            })
            setIsFavorited(response.data.status === 'added')
        } catch (error) {
            console.log(error)
        }
    }

    const handleClick = async movie => {
        if (trailerUrl) {
            setTrailerUrl('')
        } else {
            try {
                let trailerurl = await axios.get(
                    `api/getTrailer?movieId=${movie.id}`,
                )
                setTrailerUrl(prev => [...prev, trailerurl.data.results[0]?.key])                    
                setTrailerFlag(true)
            } catch (error) {
                console.log(error);
                setTrailerFlag(false)
            }
        }
    }

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const [reviewResponse, favoriteResponse] = await Promise.all([
                    laravelAxios.get(`api/reviews/${media_type}/${media_id}`),
                    laravelAxios.get(`api/favorites/status`, {
                        params: {
                            media_type: media_type,
                            media_id: media_id,
                        }
                    })
                ])
                const fetchReviews = reviewResponse.data
                setReviews(fetchReviews)
                updateAverageRating(fetchReviews)

                const fetchFavorite = favoriteResponse.data
                setIsFavorited(fetchFavorite)

            } catch (error) {
                console.log(error)
            }
        }

        fetchReviews()
    }, [media_type, media_id])

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detail
                </h2>
            }>
            <Head>
                <title>Laravel - Detail</title>
            </Head>
            {/* 映画内容 */}
            <Box
                sx={{
                    height: { xs: 'auto', md: '70vh' },
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                <Box
                    sx={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original${detail.backdrop_path})`,
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
                                handleClick(detail)
                            }}>
                            {trailerFlag ? (
                                <ReactPlayer
                                    url={`https://www.youtube.com/watch?v=${trailerUrl}`}
                                />
                            ) : (
                                <img
                                    src={`https://image.tmdb.org/t/p/original${detail.backdrop_path}`}
                                    alt=""
                                />
                            )}
                        </Box>
                    </Grid>

                    <Grid item md={5}>
                            <Typography variant="h4" paragraph>
                                {detail.title}
                            </Typography>

                            <IconButton
                                onClick={handleToggleFavorite}
                                style={{
                                    color: isFavorited ? 'red' : 'white',
                                    background: '#0d253f',
                                }}>
                                <FavoriteIcon />
                            </IconButton>

                            <Typography paragraph>{detail.overview}</Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}>
                                <Rating
                                    readOnly
                                    precision={0.5}
                                    value={parseFloat(averageRating)}
                                    emptyIcon={
                                        <StarIcon style={{ color: 'white' }} />
                                    }
                                />

                                <Typography
                                    sx={{
                                        ml: 1,
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                    }}>
                                    {averageRating}
                                </Typography>
                            </Box>

                            <Typography variant="h6">
                                {detail.release_date}
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            {/* レビュー内容 */}
            <Container sx={{ py: 4 }}>
                <Typography
                    component={'h1'}
                    variant="h4"
                    align="center"
                    gutterBottom>
                    レビュー一覧
                </Typography>

                <Grid container spacing={3}>
                    {reviews.map(review => (
                        <Grid item xs={12} key={review.id}>
                            <Card>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        component={'div'}
                                        gutterBottom>
                                        {review.user.name}
                                    </Typography>
                                    {editMode === review.id ? (
                                        <>
                                            <Rating
                                                value={editedRating}
                                                onChange={(e, newValue) =>
                                                    setEditedRating(newValue)
                                                }
                                            />
                                            <TextareaAutosize
                                                minRows={3}
                                                style={{ width: '100%' }}
                                                value={editedContent}
                                                onChange={e =>
                                                    setEditedContent(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Rating
                                                value={review.rating}
                                                readOnly
                                            />

                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                paragraph>
                                                {review.content}
                                            </Typography>
                                        </>
                                    )}

                                    {user?.id === review.user.id && (
                                        <Grid
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}>
                                            {editMode === review.id ? (
                                                <Button
                                                    onClick={() =>
                                                        handleConfirmEdit(
                                                            review.id,
                                                        )
                                                    }
                                                    disabled={
                                                        isEditButtonDisabled
                                                    }>
                                                    確定
                                                </Button>
                                            ) : (
                                                <ButtonGroup>
                                                    <Button
                                                        onClick={() =>
                                                            handleEdit(review)
                                                        }>
                                                        編集
                                                    </Button>
                                                    <Button
                                                        color="error"
                                                        onClick={() =>
                                                            handleDelete(
                                                                review.id,
                                                            )
                                                        }>
                                                        削除
                                                    </Button>
                                                </ButtonGroup>
                                            )}
                                        </Grid>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            {/* レビュー追加ボタン */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    zIndex: 5,
                }}>
                <Tooltip title="レビュー追加">
                    <Fab
                        style={{ background: '#1976d2', color: 'white' }}
                        onClick={handleOpen}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Box>
            {/* モーダルウィンドウ */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'white',
                        border: '2px, solid, #000',
                        boxShadow: 24,
                        p: 4,
                        zIndex: 6,
                    }}>
                    <Typography variant="h6" component="h2">
                        レビューを書く
                    </Typography>
                    <Rating
                        required
                        onChange={handleRatingChange}
                        value={rating}
                    />
                    <TextareaAutosize
                        required
                        minRows={5}
                        placeholder="レビュー内容"
                        style={{ width: '100%', marginTop: '10px', color: 'gray'}}
                        onChange={handleReviwChange}
                        value={review}
                    />

                    <Button
                        variant="outlined"
                        disabled={isReviewButtonDisabled}
                        onClick={handleReviewAdd}>
                        送信
                    </Button>
                </Box>
            </Modal>
        </AppLayout>
    )
}

//SSR
export const getServerSideProps = async context => {
    const { media_type, media_id } = context.params

    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`,
        )
        // const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`);
        const fetchData = response.data

        return {
            props: { detail: fetchData, media_type, media_id },
        }
    } catch (error) {
        return { notFound: true }
    }
}

export default Detail
