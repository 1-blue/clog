-- CreateIndex
CREATE INDEX "climbing_sessions_user_id_idx" ON "climbing_sessions"("user_id");

-- CreateIndex
CREATE INDEX "climbing_sessions_gym_id_idx" ON "climbing_sessions"("gym_id");

-- CreateIndex
CREATE INDEX "comments_post_id_idx" ON "comments"("post_id");

-- CreateIndex
CREATE INDEX "follows_following_id_idx" ON "follows"("following_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "posts_author_id_idx" ON "posts"("author_id");

-- CreateIndex
CREATE INDEX "reviews_gym_id_idx" ON "reviews"("gym_id");

-- CreateIndex
CREATE INDEX "routes_session_id_idx" ON "routes"("session_id");
