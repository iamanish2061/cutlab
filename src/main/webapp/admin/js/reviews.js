// Reviews Management
let reviews = [
    {
        id: 1,
        productId: 1,
        productName: 'Professional Hair Shampoo',
        customerId: 1,
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@email.com',
        rating: 5,
        title: 'Excellent product!',
        comment: 'This shampoo has completely transformed my hair. It feels so much cleaner and healthier after using it for just a week. Highly recommended!',
        date: '2024-07-18',
        status: 'approved',
        helpful: 12,
        verified: true
    },
    {
        id: 2,
        productId: 3,
        productName: 'Anti-Aging Face Cream',
        customerId: 2,
        customerName: 'Emma Wilson',
        customerEmail: 'emma.wilson@email.com',
        rating: 4,
        title: 'Good results, but pricey',
        comment: 'I\'ve been using this cream for about 3 months now and I can see some improvements in my skin texture. However, it is quite expensive for the amount you get.',
        date: '2024-07-15',
        status: 'approved',
        helpful: 8,
        verified: true
    },
    {
        id: 3,
        productId: 4,
        productName: 'Professional Hair Dryer',
        customerId: 3,
        customerName: 'Mike Davis',
        customerEmail: 'mike.davis@email.com',
        rating: 5,
        title: 'Professional quality',
        comment: 'As a hairstylist, I need reliable tools. This hair dryer is fantastic - powerful, durable, and dries hair quickly without damage.',
        date: '2024-07-20',
        status: 'pending',
        helpful: 3,
        verified: true
    },
    {
        id: 4,
        productId: 2,
        productName: 'Moisturizing Hair Conditioner',
        customerId: 4,
        customerName: 'Lisa Brown',
        customerEmail: 'lisa.brown@email.com',
        rating: 3,
        title: 'Average product',
        comment: 'It\'s okay, but I\'ve used better conditioners for the same price. It does moisturize but the effect doesn\'t last very long.',
        date: '2024-07-12',
        status: 'approved',
        helpful: 5,
        verified: false
    },
    {
        id: 5,
        productId: 5,
        productName: 'Liquid Foundation',
        customerId: 5,
        customerName: 'Jennifer Garcia',
        customerEmail: 'jennifer.garcia@email.com',
        rating: 2,
        title: 'Not suitable for my skin tone',
        comment: 'The coverage is decent, but the color range is limited. I couldn\'t find a good match for my skin tone.',
        date: '2024-07-10',
        status: 'flagged',
        helpful: 2,
        verified: true
    },
    {
        id: 6,
        productId: 1,
        productName: 'Professional Hair Shampoo',
        customerId: 6,
        customerName: 'David Kim',
        customerEmail: 'david.kim@email.com',
        rating: 4,
        title: 'Great for oily hair',
        comment: 'Perfect for my oily hair type. Leaves my hair feeling clean without stripping it completely. Will definitely repurchase.',
        date: '2024-07-08',
        status: 'approved',
        helpful: 9,
        verified: true
    }
];

function renderReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = `
        <div class="reviews-header">
            <div class="reviews-stats">
                <div class="stat-item">
                    <h3>${reviews.length}</h3>
                    <p>Total Reviews</p>
                </div>
                <div class="stat-item">
                    <h3>${calculateAverageRating().toFixed(1)}</h3>
                    <p>Average Rating</p>
                </div>
                <div class="stat-item">
                    <h3>${reviews.filter(r => r.status === 'pending').length}</h3>
                    <p>Pending Reviews</p>
                </div>
            </div>
            <div class="reviews-filters">
                <select id="reviewStatusFilter" onchange="filterReviews()">
                    <option value="">All Reviews</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="flagged">Flagged</option>
                </select>
                <select id="reviewRatingFilter" onchange="filterReviews()">
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>
        </div>
        <div class="reviews-list">
            ${reviews.map(review => createReviewCard(review)).join('')}
        </div>
    `;
}

function createReviewCard(review) {
    return `
        <div class="review-card ${review.status}" data-review-id="${review.id}">
            <div class="review-header">
                <div class="customer-info">
                    <div class="customer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="customer-details">
                        <h4>${review.customerName} ${review.verified ? '<i class="fas fa-check-circle verified" title="Verified Purchase"></i>' : ''}</h4>
                        <p>${review.customerEmail}</p>
                        <span class="review-date">${formatDate(review.date)}</span>
                    </div>
                </div>
                <div class="review-status">
                    <span class="status ${review.status}">${review.status}</span>
                    <div class="review-rating">
                        ${generateStars(review.rating)}
                    </div>
                </div>
            </div>
            
            <div class="review-content">
                <div class="product-info">
                    <span class="product-name">${review.productName}</span>
                </div>
                <h5 class="review-title">${review.title}</h5>
                <p class="review-comment">${review.comment}</p>
            </div>
            
            <div class="review-footer">
                <div class="review-helpful">
                    <i class="fas fa-thumbs-up"></i>
                    <span>${review.helpful} people found this helpful</span>
                </div>
                <div class="review-actions">
                    ${review.status === 'pending' ? `
                        <button class="btn-small approve" onclick="approveReview(${review.id})">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn-small reject" onclick="rejectReview(${review.id})">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : ''}
                    ${review.status === 'flagged' ? `
                        <button class="btn-small approve" onclick="approveReview(${review.id})">
                            <i class="fas fa-check"></i> Approve
                        </button>
                    ` : ''}
                    <button class="btn-small flag" onclick="flagReview(${review.id})">
                        <i class="fas fa-flag"></i> Flag
                    </button>
                    <button class="btn-small delete" onclick="deleteReview(${review.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? 'filled' : ''}"></i>`;
    }
    return stars;
}

function calculateAverageRating() {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function filterReviews() {
    const statusFilter = document.getElementById('reviewStatusFilter')?.value || '';
    const ratingFilter = document.getElementById('reviewRatingFilter')?.value || '';
    
    let filteredReviews = reviews;
    
    if (statusFilter) {
        filteredReviews = filteredReviews.filter(review => review.status === statusFilter);
    }
    
    if (ratingFilter) {
        filteredReviews = filteredReviews.filter(review => review.rating === parseInt(ratingFilter));
    }
    
    const reviewsList = document.querySelector('.reviews-list');
    if (reviewsList) {
        reviewsList.innerHTML = filteredReviews.map(review => createReviewCard(review)).join('');
    }
}

function approveReview(reviewId) {
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex !== -1) {
        reviews[reviewIndex].status = 'approved';
        renderReviews();
        showNotification('Review approved successfully', 'success');
    }
}

function rejectReview(reviewId) {
    if (confirm('Are you sure you want to reject this review?')) {
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);
        if (reviewIndex !== -1) {
            reviews.splice(reviewIndex, 1);
            renderReviews();
            showNotification('Review rejected and removed', 'success');
        }
    }
}

function flagReview(reviewId) {
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex !== -1) {
        reviews[reviewIndex].status = 'flagged';
        renderReviews();
        showNotification('Review flagged for review', 'info');
    }
}

function deleteReview(reviewId) {
    if (confirm('Are you sure you want to permanently delete this review?')) {
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);
        if (reviewIndex !== -1) {
            reviews.splice(reviewIndex, 1);
            renderReviews();
            showNotification('Review deleted successfully', 'success');
        }
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'info' ? 'info' : 'exclamation'}-circle"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'info' ? '#6366F1' : '#EF4444'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    renderReviews();
});

// Export functions for global access
window.approveReview = approveReview;
window.rejectReview = rejectReview;
window.flagReview = flagReview;
window.deleteReview = deleteReview;
window.filterReviews = filterReviews;