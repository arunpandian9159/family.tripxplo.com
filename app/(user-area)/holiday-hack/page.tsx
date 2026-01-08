"use client";

import React, { useState } from "react";
import {
  Download,
  Calendar,
  Plane,
  MapPin,
  Sparkles,
  MessageCircle,
} from "lucide-react";

import { jsPDF } from "jspdf";
import Link from "next/link";

// Holiday data for 2026 (Tamil Nadu/India context) - Complete Year Calendar
const holidayData = [
  {
    id: 1,
    month: "January",
    event: "New Year & Pongal Special 🎊",
    dates: [
      { day: 1, label: "New Year Day", type: "holiday" },
      { day: 2, label: "Take Leave", type: "leave" },
      { day: 3, label: "Saturday", type: "weekend" },
      { day: 4, label: "Sunday", type: "weekend" },
      { day: 14, label: "Pongal", type: "holiday" },
      { day: 15, label: "Thiruvalluvar Day", type: "holiday" },
      { day: 16, label: "Uzhavar Thirunal", type: "holiday" },
      { day: 17, label: "Saturday", type: "weekend" },
      { day: 18, label: "Sunday", type: "weekend" },
    ],
    leavesRequired: 1,
    totalDays: 9,
    bestFor: "North India / Manali",
    highlight: "Pongal Festival",
    icon: "🎉",
  },
  {
    id: 2,
    month: "January",
    event: "Republic Day Weekend 🇮🇳",
    dates: [
      { day: 24, label: "Saturday", type: "weekend" },
      { day: 25, label: "Sunday", type: "weekend" },
      { day: 26, label: "Republic Day", type: "holiday" },
    ],
    leavesRequired: 0,
    totalDays: 3,
    bestFor: "Delhi / Jaipur",
    highlight: "No Leave Needed!",
    icon: "🇮🇳",
  },
  {
    id: 3,
    month: "February",
    event: "Maha Shivaratri Long Weekend 🙏",
    dates: [
      { day: 14, label: "Saturday", type: "weekend" },
      { day: 15, label: "Sunday", type: "weekend" },
      { day: 16, label: "Take Leave", type: "leave" },
      { day: 17, label: "Maha Shivaratri", type: "holiday" },
    ],
    leavesRequired: 1,
    totalDays: 4,
    bestFor: "Varanasi / Rishikesh",
    highlight: "Spiritual Journey",
    icon: "🕉️",
  },
  {
    id: 4,
    month: "March",
    event: "Holi Festival 🎨",
    dates: [
      { day: 4, label: "Holi", type: "holiday" },
      { day: 5, label: "Take Leave", type: "leave" },
      { day: 6, label: "Take Leave", type: "leave" },
      { day: 7, label: "Saturday", type: "weekend" },
      { day: 8, label: "Sunday", type: "weekend" },
    ],
    leavesRequired: 2,
    totalDays: 5,
    bestFor: "Mathura / Vrindavan",
    highlight: "Festival of Colors",
    icon: "🎨",
  },
  {
    id: 5,
    month: "April",
    event: "Tamil New Year & Easter 🌸",
    dates: [
      { day: 3, label: "Good Friday", type: "holiday" },
      { day: 4, label: "Saturday", type: "weekend" },
      { day: 5, label: "Easter Sunday", type: "weekend" },
      { day: 14, label: "Tamil New Year", type: "holiday" },
    ],
    leavesRequired: 0,
    totalDays: 4,
    bestFor: "Ooty / Kodaikanal",
    highlight: "Spring Getaway",
    icon: "🌺",
  },
  {
    id: 6,
    month: "May",
    event: "May Day Weekend ✊",
    dates: [
      { day: 1, label: "May Day", type: "holiday" },
      { day: 2, label: "Saturday", type: "weekend" },
      { day: 3, label: "Sunday", type: "weekend" },
    ],
    leavesRequired: 0,
    totalDays: 3,
    bestFor: "Goa / Pondicherry",
    highlight: "Beach Vacation",
    icon: "🏖️",
  },
  {
    id: 7,
    month: "July",
    event: "Bakrid Long Weekend 🕌",
    dates: [
      { day: 17, label: "Take Leave", type: "leave" },
      { day: 18, label: "Saturday", type: "weekend" },
      { day: 19, label: "Sunday", type: "weekend" },
      { day: 20, label: "Bakrid", type: "holiday" },
    ],
    leavesRequired: 1,
    totalDays: 4,
    bestFor: "Kashmir / Ladakh",
    highlight: "Mountain Escape",
    icon: "🏔️",
  },
  {
    id: 8,
    month: "August",
    event: "Independence Day Special 🇮🇳",
    dates: [
      { day: 15, label: "Independence Day", type: "holiday" },
      { day: 16, label: "Sunday", type: "weekend" },
      { day: 17, label: "Take Leave", type: "leave" },
      { day: 18, label: "Janmashtami", type: "holiday" },
    ],
    leavesRequired: 1,
    totalDays: 4,
    bestFor: "Mathura / Dwarka",
    highlight: "Double Festival",
    icon: "🪔",
  },
  {
    id: 9,
    month: "September",
    event: "Ganesh Chaturthi 🐘",
    dates: [
      { day: 12, label: "Saturday", type: "weekend" },
      { day: 13, label: "Sunday", type: "weekend" },
      { day: 14, label: "Ganesh Chaturthi", type: "holiday" },
    ],
    leavesRequired: 0,
    totalDays: 3,
    bestFor: "Mumbai / Pune",
    highlight: "No Leave Needed!",
    icon: "🐘",
  },
  {
    id: 10,
    month: "October",
    event: "Gandhi Jayanti Weekend 🕊️",
    dates: [
      { day: 2, label: "Gandhi Jayanti", type: "holiday" },
      { day: 3, label: "Saturday", type: "weekend" },
      { day: 4, label: "Sunday", type: "weekend" },
    ],
    leavesRequired: 0,
    totalDays: 3,
    bestFor: "Ahmedabad / Porbandar",
    highlight: "Heritage Trip",
    icon: "🕊️",
  },
  {
    id: 11,
    month: "October",
    event: "Dussehra Mega Weekend 🏹",
    dates: [
      { day: 17, label: "Saturday", type: "weekend" },
      { day: 18, label: "Sunday", type: "weekend" },
      { day: 19, label: "Take Leave", type: "leave" },
      { day: 20, label: "Dussehra", type: "holiday" },
    ],
    leavesRequired: 1,
    totalDays: 4,
    bestFor: "Mysore / Kullu",
    highlight: "Dussehra Celebrations",
    icon: "🏹",
  },
  {
    id: 12,
    month: "November",
    event: "Diwali Mega Vacation 🪔✨",
    dates: [
      { day: 7, label: "Saturday", type: "weekend" },
      { day: 8, label: "Sunday", type: "weekend" },
      { day: 9, label: "Diwali", type: "holiday" },
      { day: 10, label: "Govardhan Puja", type: "holiday" },
      { day: 11, label: "Bhai Dooj", type: "holiday" },
      { day: 12, label: "Take Leave", type: "leave" },
      { day: 13, label: "Take Leave", type: "leave" },
      { day: 14, label: "Saturday", type: "weekend" },
      { day: 15, label: "Sunday", type: "weekend" },
    ],
    leavesRequired: 2,
    totalDays: 9,
    bestFor: "Jaipur / Udaipur / International",
    highlight: "Festival of Lights",
    icon: "🪔",
  },
  {
    id: 13,
    month: "December",
    event: "Christmas & New Year 🎄🎊",
    dates: [
      { day: 25, label: "Christmas", type: "holiday" },
      { day: 26, label: "Saturday", type: "weekend" },
      { day: 27, label: "Sunday", type: "weekend" },
      { day: 28, label: "Take Leave", type: "leave" },
      { day: 29, label: "Take Leave", type: "leave" },
      { day: 30, label: "Take Leave", type: "leave" },
      { day: 31, label: "New Year Eve", type: "leave" },
      { day: 1, label: "New Year 2027", type: "holiday" },
    ],
    leavesRequired: 4,
    totalDays: 8,
    bestFor: "Goa / Europe / Thailand",
    highlight: "Year End Celebration",
    icon: "🎄",
  },
];

// Calculate totals
const totalLeaves = holidayData.reduce((sum, h) => sum + h.leavesRequired, 0);
const totalDaysOff = holidayData.reduce((sum, h) => sum + h.totalDays, 0);

export default function HolidayHackPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Helper function to remove emojis and special characters
      const removeEmojis = (text: string) => {
        return text
          .replace(
            /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]|[\u{FE00}-\u{FE0F}]/gu,
            ""
          )
          .trim();
      };

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let yPos = margin;

      // Colors
      const emerald = [30, 192, 137];
      const red = [239, 68, 68];
      const blue = [59, 130, 246];
      const yellow = [250, 204, 21];
      const slate = [71, 85, 105];
      const slateLight = [148, 163, 184];

      // Helper function to check page break
      const checkPageBreak = (neededHeight: number) => {
        if (yPos + neededHeight > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
          return true;
        }
        return false;
      };

      // ===== TITLE SECTION =====
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.text("TripXplo 2026 Smart Leave Calendar", pageWidth / 2, yPos, {
        align: "center",
      });
      yPos += 10;

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...(red as [number, number, number]));
      pdf.text(`Turn ${totalLeaves} Leaves`, pageWidth / 2 - 25, yPos, {
        align: "center",
      });
      pdf.setTextColor(...(emerald as [number, number, number]));
      pdf.text(
        `into ${totalDaysOff} Days of Travel!`,
        pageWidth / 2 + 25,
        yPos,
        { align: "center" }
      );
      yPos += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(...(slateLight as [number, number, number]));
      pdf.text(
        "Plan your vacations smartly with Tamil Nadu & Indian holidays",
        pageWidth / 2,
        yPos,
        { align: "center" }
      );
      yPos += 12;

      // ===== STATS BOXES =====
      const boxWidth = (contentWidth - 10) / 3;
      const boxHeight = 18;

      // Long Weekends
      pdf.setFillColor(236, 253, 245);
      pdf.roundedRect(margin, yPos, boxWidth, boxHeight, 3, 3, "F");
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...(emerald as [number, number, number]));
      pdf.text(String(holidayData.length), margin + boxWidth / 2, yPos + 8, {
        align: "center",
      });
      pdf.setFontSize(8);
      pdf.setTextColor(...(slateLight as [number, number, number]));
      pdf.text("Long Weekends", margin + boxWidth / 2, yPos + 14, {
        align: "center",
      });

      // Leaves Needed
      pdf.setFillColor(254, 242, 242);
      pdf.roundedRect(
        margin + boxWidth + 5,
        yPos,
        boxWidth,
        boxHeight,
        3,
        3,
        "F"
      );
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...(red as [number, number, number]));
      pdf.text(
        String(totalLeaves),
        margin + boxWidth + 5 + boxWidth / 2,
        yPos + 8,
        { align: "center" }
      );
      pdf.setFontSize(8);
      pdf.setTextColor(...(slateLight as [number, number, number]));
      pdf.text(
        "Leaves Needed",
        margin + boxWidth + 5 + boxWidth / 2,
        yPos + 14,
        { align: "center" }
      );

      // Days Off
      pdf.setFillColor(239, 246, 255);
      pdf.roundedRect(
        margin + 2 * (boxWidth + 5),
        yPos,
        boxWidth,
        boxHeight,
        3,
        3,
        "F"
      );
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...(blue as [number, number, number]));
      pdf.text(
        String(totalDaysOff),
        margin + 2 * (boxWidth + 5) + boxWidth / 2,
        yPos + 8,
        { align: "center" }
      );
      pdf.setFontSize(8);
      pdf.setTextColor(...(slateLight as [number, number, number]));
      pdf.text(
        "Days Off",
        margin + 2 * (boxWidth + 5) + boxWidth / 2,
        yPos + 14,
        { align: "center" }
      );

      yPos += boxHeight + 10;

      // ===== HOLIDAY CARDS =====
      const cardWidth = (contentWidth - 16) / 3;
      let col = 0;
      let rowStartY = yPos;

      for (let i = 0; i < holidayData.length; i++) {
        const holiday = holidayData[i];
        const cardHeight = 12 + Math.min(holiday.dates.length, 6) * 5 + 14;

        // Check if we need a new page
        if (checkPageBreak(cardHeight + 5)) {
          col = 0;
          rowStartY = yPos;
        }

        const xPos = margin + col * (cardWidth + 8);

        // Card background
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(226, 232, 240);
        pdf.roundedRect(xPos, yPos, cardWidth, cardHeight, 3, 3, "FD");

        // Month badge (yellow)
        pdf.setFillColor(...(yellow as [number, number, number]));
        pdf.roundedRect(xPos + 4, yPos + 4, 22, 6, 2, 2, "F");
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(113, 63, 18);
        pdf.text(holiday.month.substring(0, 3), xPos + 15, yPos + 8.5, {
          align: "center",
        });

        // Leave badge (right side)
        if (holiday.leavesRequired === 0) {
          pdf.setFillColor(209, 250, 229);
          pdf.roundedRect(xPos + cardWidth - 20, yPos + 4, 16, 6, 2, 2, "F");
          pdf.setFontSize(6);
          pdf.setTextColor(21, 128, 92);
          pdf.text("Free!", xPos + cardWidth - 12, yPos + 8, {
            align: "center",
          });
        } else {
          pdf.setFillColor(254, 226, 226);
          pdf.roundedRect(xPos + cardWidth - 24, yPos + 4, 20, 6, 2, 2, "F");
          pdf.setFontSize(6);
          pdf.setTextColor(185, 28, 28);
          pdf.text(
            `${holiday.leavesRequired}L → ${holiday.totalDays}D`,
            xPos + cardWidth - 14,
            yPos + 8,
            { align: "center" }
          );
        }

        // Event name
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(30, 41, 59);
        const eventName = removeEmojis(holiday.event);
        const truncatedEvent =
          eventName.length > 35
            ? eventName.substring(0, 33) + "..."
            : eventName;
        pdf.text(truncatedEvent, xPos + 4, yPos + 16);

        // Dates (show max 6)
        let dateY = yPos + 22;
        const datesToShow = holiday.dates.slice(0, 6);
        for (const date of datesToShow) {
          // Date circle
          let circleColor: [number, number, number];
          if (date.type === "holiday")
            circleColor = emerald as [number, number, number];
          else if (date.type === "leave")
            circleColor = red as [number, number, number];
          else circleColor = blue as [number, number, number];

          pdf.setFillColor(...circleColor);
          pdf.circle(xPos + 8, dateY - 1.5, 2.5, "F");
          pdf.setFontSize(5);
          pdf.setTextColor(255, 255, 255);
          pdf.text(String(date.day), xPos + 8, dateY - 0.5, {
            align: "center",
          });

          // Date label
          pdf.setFontSize(7);
          pdf.setTextColor(...(slate as [number, number, number]));
          pdf.text(date.label, xPos + 14, dateY);

          dateY += 5;
        }

        // Best for
        pdf.setFontSize(6);
        pdf.setTextColor(...(slateLight as [number, number, number]));
        pdf.text(
          `Best for: ${holiday.bestFor}`,
          xPos + 4,
          yPos + cardHeight - 4
        );

        col++;
        if (col >= 3) {
          col = 0;
          yPos += cardHeight + 5;
          rowStartY = yPos;
        }
      }

      // Handle remaining cards
      if (col > 0) {
        yPos = rowStartY + 60;
      }

      // ===== LEGEND =====
      checkPageBreak(20);
      yPos += 5;

      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(margin, yPos, contentWidth, 12, 3, 3, "F");

      const legendX = margin + 15;
      pdf.setFontSize(7);

      // Holiday legend
      pdf.setFillColor(...(emerald as [number, number, number]));
      pdf.circle(legendX, yPos + 6, 2, "F");
      pdf.setTextColor(...(slate as [number, number, number]));
      pdf.text("Public Holiday", legendX + 5, yPos + 7);

      // Leave legend
      pdf.setFillColor(...(red as [number, number, number]));
      pdf.circle(legendX + 45, yPos + 6, 2, "F");
      pdf.text("Take Leave", legendX + 50, yPos + 7);

      // Weekend legend
      pdf.setFillColor(...(blue as [number, number, number]));
      pdf.circle(legendX + 85, yPos + 6, 2, "F");
      pdf.text("Weekend", legendX + 90, yPos + 7);

      yPos += 18;

      // ===== FOOTER =====
      checkPageBreak(25);

      pdf.setFillColor(255, 95, 95);
      pdf.roundedRect(margin, yPos, contentWidth, 20, 3, 3, "F");

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 255, 255);
      pdf.text("Plan Your 2026 with TripXplo!", pageWidth / 2, yPos + 9, {
        align: "center",
      });

      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        "Visit tripxplo.com | WhatsApp: +91 94424 24492",
        pageWidth / 2,
        yPos + 16,
        { align: "center" }
      );

      // Save the PDF
      pdf.save("TripXplo_2026_Calendar.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getDateTypeColor = (type: string) => {
    switch (type) {
      case "holiday":
        return "bg-emerald-500 text-white";
      case "leave":
        return "bg-red-500 text-white animate-pulse";
      case "weekend":
        return "bg-blue-500 text-white";
      default:
        return "bg-slate-200 text-slate-700";
    }
  };

  const getDateTypeBadge = (type: string) => {
    switch (type) {
      case "holiday":
        return "🎉 Holiday";
      case "leave":
        return "📝 Take Leave";
      case "weekend":
        return "🌙 Weekend";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/50">
      {/* Sticky Download Button - Mobile */}
      <div className="fixed bottom-20 right-4 z-40 lg:hidden">
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          {isDownloading ? "..." : "PDF"}
        </button>
      </div>

      {/* Header Section */}
      <header className="relative pt-20 lg:pt-24 pb-8 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Smart Leave Planner 2026
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            TripXplo 2026 Smart Leave Calendar{" "}
            <span className="inline-block animate-bounce-subtle">🗓️</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-2">
            Turn{" "}
            <span className="text-red-500 font-bold">{totalLeaves} Leaves</span>{" "}
            into{" "}
            <span className="text-emerald-600 font-bold">
              {totalDaysOff} Days
            </span>{" "}
            of Travel! <span className="inline-block animate-float">✈️</span>
          </p>

          <p className="text-sm text-slate-500 mb-6">
            Plan your vacations smartly with Tamil Nadu & Indian holidays
          </p>

          {/* Desktop Download Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="hidden lg:inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {isDownloading ? "Generating PDF..." : "Download PDF Calendar"}
          </button>
        </div>
      </header>

      {/* Calendar Grid */}
      <main className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 md:p-5 text-center shadow-sm border border-emerald-200/50">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600">
                {holidayData.length}
              </div>
              <div className="text-xs md:text-sm text-emerald-600/70 font-medium mt-1">
                Long Weekends
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 md:p-5 text-center shadow-sm border border-red-200/50">
              <div className="text-3xl md:text-4xl font-bold text-red-500">
                {totalLeaves}
              </div>
              <div className="text-xs md:text-sm text-red-500/70 font-medium mt-1">
                Leaves Needed
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 md:p-5 text-center shadow-sm border border-blue-200/50">
              <div className="text-3xl md:text-4xl font-bold text-blue-600">
                {totalDaysOff}
              </div>
              <div className="text-xs md:text-sm text-blue-600/70 font-medium mt-1">
                Days Off
              </div>
            </div>
          </div>

          {/* Holiday Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {holidayData.map((holiday, index) => (
              <div
                key={holiday.id}
                className={`group relative bg-white rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
                  holiday.leavesRequired === 0
                    ? "border-l-4 border-l-emerald-500"
                    : "border-l-4 border-l-emerald-500"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Decorative gradient overlay */}
                <div
                  className={`absolute top-0 right-0 w-24 h-24 opacity-10 ${
                    holiday.leavesRequired === 0
                      ? "bg-gradient-to-br from-emerald-500 to-transparent"
                      : "bg-gradient-to-br from-emerald-500 to-transparent"
                  }`}
                />

                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 text-xs font-bold rounded-lg shadow-sm">
                      {holiday.month}
                    </div>
                  </div>
                  <div>
                    {holiday.leavesRequired === 0 ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm">
                        ✨ FREE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-red-500 text-white text-xs font-bold rounded-lg shadow-sm">
                        {holiday.leavesRequired}L → {holiday.totalDays}D
                      </span>
                    )}
                  </div>
                </div>

                {/* Event Title */}
                <h3 className="font-bold text-slate-800 text-base mb-3">
                  {holiday.event}
                </h3>

                {/* The Math - Highlight Box */}
                <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-slate-500 font-medium">Take</span>
                    <span className="px-2.5 py-1 bg-red-500 text-white font-bold rounded-md shadow-sm">
                      {holiday.leavesRequired}
                    </span>
                    <span className="text-slate-400">=</span>
                    <span className="px-2.5 py-1 bg-emerald-500 text-white font-bold rounded-md shadow-sm">
                      {holiday.totalDays}
                    </span>
                    <span className="text-slate-500 font-medium">Days Off</span>
                  </div>
                </div>

                {/* Visual Timeline */}
                <div className="space-y-2 mb-4">
                  {holiday.dates.slice(0, 6).map((date, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <span
                        className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold shadow-sm ${getDateTypeColor(
                          date.type
                        )}`}
                      >
                        {date.day}
                      </span>
                      <span className="text-slate-700 flex-1 font-medium">
                        {date.label}
                      </span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">
                        {getDateTypeBadge(date.type)}
                      </span>
                    </div>
                  ))}
                  {holiday.dates.length > 6 && (
                    <div className="text-xs text-slate-400 text-center py-1">
                      +{holiday.dates.length - 6} more days...
                    </div>
                  )}
                </div>

                {/* Recommended Trip */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-slate-500">Best for:</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {holiday.bestFor}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 p-4 bg-white/80 backdrop-blur-sm rounded-xl">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-4 h-4 bg-emerald-500 rounded"></span>
              <span className="text-slate-600">Public Holiday</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-4 h-4 bg-red-500 rounded"></span>
              <span className="text-slate-600">Take Leave</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-4 h-4 bg-blue-500 rounded"></span>
              <span className="text-slate-600">Weekend</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="px-4 pb-28 lg:pb-12">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-2xl p-6 md:p-8 text-center text-white shadow-xl">
          <Plane className="w-10 h-10 mx-auto mb-4 animate-float" />
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Plan Your 2026 with TripXplo!
          </h2>
          <p className="text-white/80 text-sm mb-6">
            Let us help you create unforgettable travel experiences
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-white/90 transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              Browse Packages
            </Link>
            <a
              href="https://wa.me/919442424492?text=Hi! I want to plan my 2026 holidays with TripXplo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
