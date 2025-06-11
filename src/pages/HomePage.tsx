import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import MostLike from './MostLike';
import { useState } from 'react';
import ReactPaginate from 'react-paginate';
import Navbar from './partials/Navbar';
import { useAuth } from '../context/AuthContext';
import Footer from './partials/Footer';
import { fetchRecommendedPosts } from '../lib/api/post';
import { useNavigate, useParams } from 'react-router-dom';
import LikeButton from './partials/LikeButton';
import { usePostDetail } from '../hooks/usePostDetail';

interface Post {
  id: string;
  title: string;
  content: string;
  likes: number;
  tags: string[];
  className?: string;
  comments?: number;
  likedByCurrentUser: boolean;
  imageUrl?: string;
  author?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt?: string;
}

interface DataResponse {
  data: Post[];
  total: number;
  page: number;
  lastPage: number;
}

const HomePage = () => {
  const [page, setPage] = useState(0);
  const [limit] = useState(5);
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refetch } = usePostDetail(id!);
  // const [setCurrentPost] = useState<Post | null>(null);

  const User = user || {
    name: 'Guest',
    avatarUrl: '/images/avatar.png', // Default avatar for guest
  };

  const {
    data = { data: [], total: 0 },
    isLoading,
    error,
  } = useQuery<DataResponse>({
    queryKey: ['recommended', page],
    queryFn: async () => {
      const res = await fetchRecommendedPosts(limit, page);
      console.log('Recommended posts data:', res);
      return res;
    },

    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });

  if (isLoading) {
    return (
      <div className='p-4 space-y-4'>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className='w-full h-24 rounded-xl' />
        ))}
      </div>
    );
  }

  if (error) {
    console.error('Error fetching recommended posts:', error);
    return <div className='p-4 text-red-500'>Gagal memuat postingan.</div>;
  }

  const handlePageClick = (selectedItem: { selected: number }) => {
    console.log('Page clicked:', selectedItem.selected);
    setPage(selectedItem.selected);
  };

  return (
    <>
      <Navbar />
      <div className='relative p-4 mx-auto custom-container' id='home-page'>
        <div className='flex flex-col md:relative md:flex-row md:gap-8'>
          <div className='z-10 flex-col space-y-4 md:left-10 md:flex md:w-full md:gap-8 md:space-y-0'>
            <h1 className='mt-6 mb-4 md:display-sm-bold text-xl-bold text-neutral-900 md:mt-12'>
              Recommended For You
            </h1>

            {Array.isArray(data.data) && data.data.length > 0
              ? data?.data.map((post) => (
                  <Card
                    key={post.id}
                    className='flex flex-row w-full border-b-2 last:border-b-0'
                  >
                    <img
                      src={post.imageUrl || '/images/image.png'}
                      width={340}
                      height={208}
                      className='hidden rounded-sm md:block md:py-4'
                      onError={(e) => {
                        e.currentTarget.src = '/images/coffee.png';
                      }}
                    />
                    <div className='flex flex-col flex-1 md:block'>
                      <CardHeader className='flex flex-col items-start'>
                        <CardTitle
                          className='flex flex-col mb-3 font-bold cursor-pointer text-md-bold text-md text-neutral-900 md:text-xl'
                          onClick={() => {
                            if (user?.id !== post.author?.id) {
                              return navigate(`/detail/${post.id}`);
                            } else navigate(`/update-post/${post.id}`);
                          }}
                        >
                          {post.title}
                          <div className='flex flex-row w-full h-full gap-4 mt-3 text-xs-regular text-neutral-900'>
                            {post.tags
                              ?.slice(0, 4)
                              .map((tag: string, idx: number) => (
                                <div
                                  key={idx}
                                  className={`text-xs-regular rounded-md border px-2 py-1 ${
                                    idx === 0
                                      ? 'border-neutral-300 text-neutral-900'
                                      : ''
                                  }`}
                                >
                                  {tag.trim()}
                                </div>
                              ))}
                          </div>
                        </CardTitle>
                        <CardDescription className='mb-4 text-gray-500 text-xs-regular md:text-sm'>
                          {post.content.slice(0, 100)}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='flex flex-row items-center flex-1 gap-4 mb-4'>
                        <img
                          src={User?.avatarUrl || '/images/avatar.png'}
                          alt='avatar'
                          width={40}
                          height={40}
                          className='w-10 h-10 rounded-full md:mr-2 md:mb-0 md:h-12 md:w-12 md:object-cover md:object-center'
                        />
                        <p className='md:text-sm-medium text-xs-text-xs-regular text-neutral-900'>
                          {post.author?.name}{' '}
                        </p>
                        <div className='w-2 h-2 border rounded-full bg-neutral-400' />
                        <p className='text-xs-regular text-neutral-600 md:text-sm'>
                          {new Date(post.createdAt || '').toLocaleDateString()}
                        </p>
                      </CardContent>
                      <CardFooter className='flex-row items-center justify-start gap-4 mb-4'>
                        <LikeButton
                          postId={id!}
                          initialLiked={post.likedByCurrentUser}
                          initialCount={post.likes}
                          onLikeChange={() => refetch()}
                        />
                        <p className='flex items-center gap-2 text-sm text-gray-500'>
                          <img src='/icons/comment.svg' />
                          {post.comments}
                        </p>
                      </CardFooter>
                    </div>
                  </Card>
                ))
              : null}

            <div className='flex justify-center mt-6'>
              <ReactPaginate
                forcePage={page}
                breakLabel='...'
                nextLabel=' Next >'
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                marginPagesDisplayed={3}
                pageCount={data?.total ? Math.ceil(data.total / limit) : 1}
                previousLabel='< Previous'
                containerClassName='flex items-center gap-2'
                pageClassName=' px-3 py-1  text-neutral-900  text-sm-regular hover:cursor-pointer'
                activeClassName='bg-blue-500 text-white rounded-full'
                previousClassName='border px-3 py-1 rounded hover:bg-gray-100 text-sm-regular text-neutral-900 hover:cursor-pointer'
                nextClassName='border px-3 py-1 rounded hover:bg-gray-100 text-sm-regular text-neutral-900 hover:cursor-pointer'
                breakClassName='px-2 py-1 text-gray-500'
                disabledClassName='opacity-50 cursor-not-allowed hover:none'
              />
            </div>
          </div>
          {/* Most Like Section */}
          <div className='z-10 w-full mt-12 md: md:right-10 md:w-1/3 md:pl-4'>
            <MostLike />
          </div>
        </div>

        {/* Footer Section */}
        <Footer />

        {/* vertical line */}
        <div className='top-0 right-[300px] bottom-30 z-50 mt-12 hidden w-px transform border-1 border-neutral-300 md:absolute md:block' />

        {/* horizontal line */}
        <div className='w-full mt-12 transform border-6 border-neutral-300 md:absolute md:hidden' />
      </div>
    </>
  );
};

export default HomePage;
