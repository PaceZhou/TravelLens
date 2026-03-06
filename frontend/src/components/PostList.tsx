import { useEffect, useRef } from 'react'
import { Heart, MessageCircle, MapPin, Bookmark } from 'lucide-react'

interface Post {
  id: string
  author: string
  avatar: string
  location: string
  city: string
  image: string
  images?: string[]
  content: string
  tags: string[]
  likes: number
  comments: number
  time: string
}

interface PostListProps {
  posts: Post[]
  onPostClick: (index: number) => void
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
  onLike: (postId: string, e: React.MouseEvent) => void
  onCollect: (postId: string, e: React.MouseEvent) => void
  likedPosts: Set<string>
  collectedPosts: Set<string>
}

export default function PostList({ posts, onPostClick, onLoadMore, hasMore, isLoading, onLike, onCollect, likedPosts, collectedPosts }: PostListProps) {
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore])

  return (
    <div className="space-y-6">
      <div className="columns-2 md:columns-3 lg:columns-3 xl:columns-4 gap-2 md:gap-6">
        {posts.map((post, index) => (
          <div
            key={post.id}
            onClick={() => onPostClick(index)}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group mb-6 break-inside-avoid"
          >
            <div className="relative overflow-hidden">
              <img
                src={post.image}
                alt={post.location}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                <MapPin size={14} className="text-white" />
                <span className="text-white text-sm font-bold">{post.location}</span>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-900 text-base leading-relaxed mb-4 font-bold">{post.content}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[#0055FF] bg-blue-50 px-2 py-1 rounded-md text-xs font-bold">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full" />
                  <span className="font-bold text-sm">{post.author}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); onLike(post.id, e); }}
                    className={`flex items-center gap-1 transition-colors ${
                      likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart size={16} fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MessageCircle size={16} />
                    <span className="text-sm">{post.comments}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onCollect(post.id, e); }}
                    className={`flex items-center gap-1 transition-colors ${
                      collectedPosts.has(post.id) ? 'text-[#FFB800]' : 'text-gray-500 hover:text-[#FFB800]'
                    }`}
                  >
                    <Bookmark size={16} fill={collectedPosts.has(post.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 无限滚动触发器 */}
      <div ref={observerRef} className="h-20 flex items-center justify-center">
        {isLoading && (
          <div className="text-gray-500 text-sm">加载中...</div>
        )}
        {!hasMore && posts.length > 0 && (
          <div className="text-gray-400 text-sm">没有更多内容了</div>
        )}
      </div>
    </div>
  )
}
