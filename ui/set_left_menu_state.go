// Copyright 2018 Frédéric Guillot. All rights reserved.
// Use of this source code is governed by the Apache 2.0
// license that can be found in the LICENSE file.

package ui // import "miniflux.app/ui"

import (
	"net/http"

	"miniflux.app/http/response/html"
	"miniflux.app/http/request"
	"miniflux.app/logger"
	"strconv"
)

func (h *handler) setLeftMenuStatus(w http.ResponseWriter, r *http.Request) {
	user, err := h.store.UserByID(request.UserID(r))
	if err != nil {
		html.ServerError(w, r, err)
		return
	}
	var state,_ = strconv.ParseBool(request.QueryStringParam(r, "status", "0"))
	user.LeftMenuState = state
	err = h.store.UpdateUser(user)
	if err != nil {
		logger.Error("[UI:setLeftMenuStatus] %v", err)
	}
}
