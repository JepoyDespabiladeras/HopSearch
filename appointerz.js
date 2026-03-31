(function () {
  "use strict";

  // Only runs once, even if the script is loaded multiple times.
  if (window.__hopsearchAppointmentInit) return;
  window.__hopsearchAppointmentInit = true;

  const $ = (sel) => document.querySelector(sel);

  const form = $("#appointmentForm");
  if (!form) return;

  const timeSlotsWrap = $("#timeSlots");
  const appointmentTimeInput = $("#appointmentTime");

  const modalOverlay = $("#modalOverlay");
  const closeModalBtn = $("#closeModalBtn");
  const editBtn = $("#editBtn");
  const confirmBtn = $("#confirmBtn");
  const modalBody = $("#modalBody");

  const clearBtn = $("#clearBtn");

  const summaryFieldIds = [
    "hospitalName",
    "department",
    "patientName",
    "appointmentDate",
    "appointmentTime",
    "visitType",
  ];

  const state = {
    selectedSlot: null, // "HH:mm"
  };

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function toISODateLocal(date) {
    // Converts a Date to YYYY-MM-DD in local time.
    const y = date.getFullYear();
    const m = pad2(date.getMonth() + 1);
    const d = pad2(date.getDate());
    return `${y}-${m}-${d}`;
  }

  function parseISODateLocal(iso) {
    // Parses YYYY-MM-DD into local date (no UTC shifting).
    const [y, m, d] = String(iso).split("-").map((x) => Number(x));
    return new Date(y, m - 1, d);
  }

  function formatTimeLabel(hhmm) {
    const [hh, mm] = hhmm.split(":").map((x) => Number(x));
    const dt = new Date();
    dt.setHours(hh, mm, 0, 0);
    return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function getTimeSlots() {
    // Hospital-friendly default schedule (edit as needed).
    const startHour = 8;
    const endHour = 17; // inclusive last starting hour is 16:30 when interval is 30
    const intervalMinutes = 30;

    const slots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const hhmm = `${pad2(hour)}:${pad2(minute)}`;
        slots.push(hhmm);
      }
    }

    // Remove the last hour's "17:30" etc. if created.
    // Our loop only creates minute 0 and 30 so the final is "17:30".
    // Keep anything up to 17:00.
    return slots.filter((t) => t <= "17:00");
  }

  function clearTimeSlotSelection() {
    state.selectedSlot = null;
    appointmentTimeInput.value = "";
    const active = timeSlotsWrap.querySelector(".slot-btn.is-active");
    if (active) active.classList.remove("is-active");
  }

  function setErrorFor(inputOrContainerId, message) {
    const err = document.querySelector(`[data-error-for="${inputOrContainerId}"]`);
    if (!err) return;
    err.textContent = message || "";
  }

  function clearAllErrors() {
    const errorNodes = form.querySelectorAll(".field-error[data-error-for]");
    errorNodes.forEach((n) => {
      n.textContent = "";
    });
  }

  function validateRequired() {
    clearAllErrors();

    const requiredIds = [
      "hospitalName",
      "department",
      "patientName",
      "age",
      "gender",
      "phone",
      "appointmentDate",
      "appointmentTime",
      "reason",
    ];

    let ok = true;

    requiredIds.forEach((id) => {
      const el = form.querySelector(`#${CSS.escape(id)}`);
      if (!el) return;

      if (el.type === "checkbox") {
        // Not used by requiredIds currently, but safe for future edits.
        if (!el.checked) {
          ok = false;
          setErrorFor(id, "Please confirm to proceed.");
        }
        return;
      }

      const value = String(el.value || "").trim();
      if (!value) {
        ok = false;
        setErrorFor(id, "This field is required.");
      }
    });

    // Validate visit type (radio group).
    const visitTypeChecked = form.querySelector('input[name="visitType"]:checked');
    if (ok && !visitTypeChecked) {
      ok = false;
      setErrorFor("visitType", "Please choose a visit type.");
    }

    // Validate consent (checkbox).
    const consentEl = $("#consent");
    if (ok && consentEl && !consentEl.checked) {
      ok = false;
      setErrorFor("consent", "Please confirm to proceed.");
    }

    // Validate age range.
    const ageEl = $("#age");
    if (ok && ageEl) {
      const age = Number(ageEl.value);
      if (!Number.isFinite(age) || age < 0 || age > 130) {
        ok = false;
        setErrorFor("age", "Please enter a valid age (0 to 130).");
      }
    }

    // Validate appointment date is not in the past.
    const dateEl = $("#appointmentDate");
    if (ok && dateEl && dateEl.value) {
      const selected = parseISODateLocal(dateEl.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      if (selected < today) {
        ok = false;
        setErrorFor("appointmentDate", "Please choose a valid date (not in the past).");
      }
    }

    // Ensure time slot is chosen.
    if (ok && !state.selectedSlot) {
      ok = false;
      setErrorFor("appointmentTime", "Please choose a time slot.");
    }

    return ok;
  }

  function renderTimeSlots() {
    timeSlotsWrap.innerHTML = "";
    clearTimeSlotSelection();

    const dateEl = $("#appointmentDate");
    if (!dateEl || !dateEl.value) return;

    const selectedDate = parseISODateLocal(dateEl.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = selectedDate.getTime() === today.getTime();

    const slots = getTimeSlots();
    const now = new Date();

    slots.forEach((hhmm) => {
      const [h, m] = hhmm.split(":").map((x) => Number(x));
      const slotDate = new Date(selectedDate);
      slotDate.setHours(h, m, 0, 0);

      // Disable past times when date is today.
      const disabled = isToday ? slotDate.getTime() < now.getTime() : false;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot-btn";
      btn.textContent = formatTimeLabel(hhmm);
      btn.dataset.time = hhmm;
      if (disabled) btn.disabled = true;

      btn.addEventListener("click", () => {
        const already = timeSlotsWrap.querySelector(".slot-btn.is-active");
        if (already) already.classList.remove("is-active");

        state.selectedSlot = hhmm;
        appointmentTimeInput.value = hhmm;
        btn.classList.add("is-active");

        updateSummary();
        setErrorFor("appointmentTime", "");
      });

      timeSlotsWrap.appendChild(btn);
    });
  }

  function updateSummary() {
    const hospitalName = $("#hospitalName") ? $("#hospitalName").value.trim() : "";
    const department = $("#department") ? $("#department").value.trim() : "";
    const patientName = $("#patientName") ? $("#patientName").value.trim() : "";
    const appointmentDate = $("#appointmentDate") ? $("#appointmentDate").value : "";
    const appointmentTime = appointmentTimeInput ? appointmentTimeInput.value : "";
    const visitTypeEl = form.querySelector('input[name="visitType"]:checked');
    const visitType = visitTypeEl ? visitTypeEl.value : "";

    const map = {
      hospitalName,
      department,
      patientName,
      appointmentDate,
      appointmentTime,
      visitType,
    };

    summaryFieldIds.forEach((id) => {
      const node = form.closest(".content-grid")?.querySelector(`[data-summary="${id}"]`);
      if (!node) return;

      const raw = map[id] || "-";
      if (id === "appointmentTime" && raw !== "-") {
        node.textContent = formatTimeLabel(raw);
      } else {
        node.textContent = raw === "" ? "-" : raw;
      }
    });
  }

  function modalOpen() {
    modalOverlay.classList.add("is-open");
    modalOverlay.setAttribute("aria-hidden", "false");
  }

  function modalClose() {
    modalOverlay.classList.remove("is-open");
    modalOverlay.setAttribute("aria-hidden", "true");
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function buildConfirmationBody() {
    const hospitalName = $("#hospitalName").value.trim();
    const department = $("#department").value.trim();
    const doctorName = ($("#doctorName").value || "").trim();
    const patientName = $("#patientName").value.trim();
    const age = $("#age").value.trim();
    const gender = $("#gender").value.trim();
    const phone = $("#phone").value.trim();
    const email = ($("#email").value || "").trim();
    const visitType = form.querySelector('input[name="visitType"]:checked')?.value || "";
    const appointmentDate = $("#appointmentDate").value.trim();
    const appointmentTime = appointmentTimeInput.value.trim();
    const reason = $("#reason").value.trim();

    return `
      <div style="display:flex; gap:12px; flex-wrap:wrap;">
        <div style="flex: 1 1 260px;">
          <div style="font-weight:800; margin-bottom:6px;">Appointment Details</div>
          <div><b>Hospital:</b> ${escapeHtml(hospitalName)}</div>
          <div><b>Department:</b> ${escapeHtml(department)}</div>
          <div><b>Preferred Doctor:</b> ${escapeHtml(doctorName || "-")}</div>
          <div><b>Visit Type:</b> ${escapeHtml(visitType)}</div>
          <div><b>Date:</b> ${escapeHtml(appointmentDate)}</div>
          <div><b>Time:</b> ${escapeHtml(formatTimeLabel(appointmentTime))}</div>
        </div>
        <div style="flex: 1 1 260px;">
          <div style="font-weight:800; margin-bottom:6px;">Patient Information</div>
          <div><b>Name:</b> ${escapeHtml(patientName)}</div>
          <div><b>Age:</b> ${escapeHtml(age)}</div>
          <div><b>Gender:</b> ${escapeHtml(gender)}</div>
          <div><b>Phone:</b> ${escapeHtml(phone)}</div>
          <div><b>Email:</b> ${escapeHtml(email || "-")}</div>
          <div style="margin-top:8px;"><b>Reason:</b></div>
          <div>${escapeHtml(reason).replaceAll("\n", "<br/>")}</div>
        </div>
      </div>
      <p style="margin:12px 0 0 0; color:#355a3f; font-size:13px;">
        After you confirm, this template will show a success message (no backend is connected).
      </p>
    `;
  }

  // Events
  $("#appointmentDate")?.addEventListener("change", () => {
    renderTimeSlots();
    updateSummary();
  });

  form.addEventListener("input", (e) => {
    // Clear errors for fields as the user types.
    const id = e.target && e.target.id ? e.target.id : null;
    if (id) setErrorFor(id, "");
    updateSummary();
  });

  form.addEventListener("change", () => {
    updateSummary();
  });

  clearBtn?.addEventListener("click", () => {
    form.reset();
    clearAllErrors();
    timeSlotsWrap.innerHTML = "";
    clearTimeSlotSelection();
    updateSummary();
  });

  closeModalBtn?.addEventListener("click", () => modalClose());
  editBtn?.addEventListener("click", () => modalClose());

  modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) modalClose();
  });

  confirmBtn?.addEventListener("click", () => {
    // Template behavior: show success and close.
    modalBody.innerHTML = `
      <div style="font-weight:800; color:#0f2a16; font-size:16px; margin-bottom:8px;">
        Request confirmed (template).
      </div>
      <div style="color:#355a3f; line-height:1.5;">
        Thank you. Your appointment request has been captured locally for this template.
        Connect a backend service to send it to the hospital establishment.
      </div>
    `;
    confirmBtn.disabled = true;
    setTimeout(() => modalClose(), 1500);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ok = validateRequired();
    if (!ok) return;

    modalBody.innerHTML = buildConfirmationBody();
    confirmBtn.disabled = false;
    modalOpen();
  });

  // Initialize: set minimum date to today for user friendliness.
  const dateEl = $("#appointmentDate");
  if (dateEl) {
    const today = new Date();
    dateEl.min = toISODateLocal(today);
  }

  // Initial summary placeholders.
  updateSummary();
})();

