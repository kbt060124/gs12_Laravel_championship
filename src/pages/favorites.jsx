import React from 'react'
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import useSWR from 'swr'
import laravelAxios from '@/lib/laravelAxios'
import { Container } from '@mui/system'
import { Grid } from '@mui/material'
import MediaCard from '@/components/MediaCard'

const favorites = () => {
    const fetcher = url => laravelAxios.get(url).then(res => res.data)
    const { data: favoriteItems, error } = useSWR('api/favorites', fetcher)

    if (error) {
        return <div>エラーが発生しました</div>
    }
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Favorites
                </h2>
            }>
            <Head>
                <title>Laravel - favorites</title>
            </Head>

            <Container>
                <Grid container spacing={3} py={3}>
                    {favoriteItems?.map(item => (
                        <MediaCard item={item} key={item.id} isContent={false} />
                    ))}
                </Grid>
            </Container>
        </AppLayout>
    )
}

export default favorites
