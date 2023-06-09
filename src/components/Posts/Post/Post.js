import React, { useState } from 'react'
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  ButtonBase
} from '@material-ui/core/'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { useHistory } from 'react-router-dom'

import { likePost, deletePost } from '../../../actions/posts'
import useStyles from './styles'

const Post = ({ post, setCurrentId }) => {
  const user = JSON.parse(localStorage.getItem('profile'))
  const [likes, setLikes] = useState(post?.likes)
  const dispatch = useDispatch()
  const history = useHistory()
  const classes = useStyles()

  const userId = user?.result.googleId || user?.result?._id
  const hasLikedPost = post?.likes?.find(like => like === userId)

  const handleLike = async () => {
    dispatch(likePost(post._id))

    if (hasLikedPost) {
      setLikes(post.likes.filter(id => id !== userId))
    } else {
      setLikes([...post.likes, userId])
    }
  }
  const Likes = () => {
    if (likes.length > 0) {
      // if userId already liked the post THEN RUN THIS
      return likes.find(like => like === userId) ? (
        //  case 1>  you & other n-1 like  ==> only work if 2 sai more like
        // case 2 > 1 like  --> singular
        //case 3 > 2 likes  --> prulal
        <>
          <ThumbUpAltIcon fontSize='medium' />
          &nbsp;
          {likes.length > 2
            ? `You and ${likes.length - 1} others`
            : `${likes.length} like${likes.length > 1 ? 's' : ''}`}
        </>
      ) : (
        // ELSE IF LOGGED IN USER NOT LIKED THE POST
        <>
          <ThumbUpAltOutlined fontSize='medium' />
          &nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
        </>
      )
    }
    // NO LIKE --> just show thum
    return (
      <>
        <ThumbUpAltOutlined fontSize='medium' />
        &nbsp;Like
      </>
    )
  }

  const openPost = e => {
    history.push(`/posts/${post._id}`)
  }

  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase
        component='span'
        name='test'
        className={classes.cardAction}
        onClick={openPost}
      >
        <CardMedia
          className={classes.media}
          image={
            post.selectedFile ||
            'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'
          }
          title={post.title}
        />
        <div className={classes.overlay}>
          <Typography variant='h6'>{post.name}</Typography>
          <Typography variant='body2'>
            {moment(post.createdAt).fromNow()}
          </Typography>
        </div>
        {/* if logged in then only  --> post mai click --> set postId --> onClick{openPost} come in action */}
        {(user?.result?.googleId === post?.creator ||
          user?.result?._id === post?.creator) && (
          <div className={classes.overlay2} name='edit'>
            <Button
              onClick={e => {
                e.stopPropagation()
                setCurrentId(post._id)
              }}
              style={{ color: 'white' }}
              size='small'
            >
              <MoreHorizIcon fontSize='medium' />
            </Button>
          </div>
        )}

        <div className={classes.details}>
          <Typography variant='body2' color='textSecondary' component='h2'>
            {post.tags.map(tag => `#${tag} `)}
          </Typography>
        </div>
        <Typography
          className={classes.title}
          gutterBottom
          variant='h5'
          component='h2'
        >
          {post.title}
        </Typography>
        <CardContent>
          {/* TODO: limiting the text */}
          <Typography variant='body2' color='textSecondary' component='p'>
            {post?.message?.split(' ').splice(0, 20)?.join(' ')}...
          </Typography>
        </CardContent>
      </ButtonBase>
      <CardActions className={classes.cardActions}>
        <Button
          size='small'
          color='primary'
          disabled={!user?.result}
          onClick={handleLike}
        >
          {/* like feature disable if user not logged in */}
          <Likes />
        </Button>
        {console.log(post)}
        {user?.result?._id === post?.creator && (
          <Button
            size='small'
            color='secondary'
            onClick={() => dispatch(deletePost(post._id))}
          >
            <DeleteIcon fontSize='medium' /> &nbsp; Delete
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default Post
