import { List, ListItemButton, ListItemText, Typography } from '@mui/material'
import React from 'react'

const Sidebar = ({setCategory}) => {
    return (
        <div>
            <Typography
                sx={{
                    bgcolor: 'blue',
                    color: 'white',
                    padding: 1,
                }}>
                カテゴリ
            </Typography>

            <List component={"nav"}>
            <ListItemButton>
                    <ListItemText onClick={() => setCategory('all')} primary="全て" style={{ color: "gray" }}></ListItemText>
                </ListItemButton>
                <ListItemButton>
                    <ListItemText onClick={() => setCategory('movie')} primary="映画" style={{ color: "gray" }}></ListItemText>
                </ListItemButton>
                <ListItemButton>
                    <ListItemText onClick={() => setCategory('tv')} primary="TV" style={{ color: "gray" }}></ListItemText>
                </ListItemButton>
            </List>
        </div>
    )
}

export default Sidebar
