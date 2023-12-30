import axios from 'axios'

export default async (req, res) => {
    const { movieId } = req.query
    console.log(movieId);

    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.TMDB_API_KEY}`,
        )
        return res.status(200).json(response.data)
    } catch (error) {
        console.log('エラー内容は…', error);
        return res
            .status(500)
            .json({ message: req });
    }
}
