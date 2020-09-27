// Copyright 2018 Frédéric Guillot. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file.

package ui // import "miniflux.app/ui"

import (
	"net/http"

	"miniflux.app/http/response/html"
	"miniflux.app/http/request"
	"miniflux.app/logger"
)

func (h *handler) setFeedCategory(w http.ResponseWriter, r *http.Request) {
	feedID := request.RouteInt64Param(r, "feedID")
	categoryID := request.RouteInt64Param(r, "categoryID")
	userID := request.UserID(r)

	logger.Error("[UI:setFeedCategory] %s %s %s", feedID, categoryID, userID);

	feed, err := h.store.FeedByID(userID, feedID)

	if err != nil {
		html.ServerError(w, r, err)
		return
	}

	if feed == nil {
		html.NotFound(w, r)
		return
	}

	category, err := h.store.Category(userID, categoryID)
	if err != nil {
		html.ServerError(w, r, err)
		return
	}

	if category == nil {
		html.NotFound(w, r)
		return
	}

	feed.Category.ID = category.ID;

	err = h.store.UpdateFeed(feed)
	if err != nil {
		logger.Error("[UI:setFeedCategory] %v", err)
		html.ServerError(w, r, err)
		return
	}
}
