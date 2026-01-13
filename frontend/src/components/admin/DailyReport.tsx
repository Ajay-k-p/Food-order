import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, IndianRupee, Package, Store } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface RestaurantStat {
  name: string;
  orderCount: number;
  revenue: number;
}

interface DailyReportData {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  topRestaurant: RestaurantStat | null;
  restaurantStats: RestaurantStat[];
}

const DailyReport = () => {
  const [reportData, setReportData] = useState<DailyReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDailyReport = async () => {
    try {
      setIsLoading(true);
      const { data } = await API.get('/admin/reports/daily');
      setReportData(data);
    } catch (err) {
      toast.error('Failed to load daily report');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyReport();
  }, []);

  const downloadPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.text('Daily Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Date
    doc.setFontSize(12);
    doc.text(`Date: ${reportData.date}`, 20, yPosition);
    yPosition += 15;

    // Summary Stats
    doc.setFontSize(14);
    doc.text('Summary', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.text(`Total Orders: ${reportData.totalOrders}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Total Revenue: Rs. ${reportData.totalRevenue.toLocaleString()}`, 20, yPosition);
    yPosition += 8;

    if (reportData.topRestaurant) {
      doc.text(`Top Restaurant: ${reportData.topRestaurant.name} (${reportData.topRestaurant.orderCount} orders)`, 20, yPosition);
      yPosition += 15;
    }

    // Restaurant Stats
    doc.setFontSize(14);
    doc.text('Restaurant Statistics', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    reportData.restaurantStats.forEach((stat, index) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${index + 1}. ${stat.name}`, 20, yPosition);
      doc.text(`${stat.orderCount} orders`, 120, yPosition);
      doc.text(`Rs. ${stat.revenue.toLocaleString()}`, 160, yPosition);
      yPosition += 8;
    });

    // Footer
    doc.setFontSize(8);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 20, pageHeight - 10);

    doc.save(`daily-report-${reportData.date}.pdf`);
    toast.success('PDF downloaded successfully');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Daily Report</h2>
          <Button disabled>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-sm">Loading...</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">-</CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Daily Report</h2>
          <Button disabled>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No data available for today</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Daily Report - {reportData.date}</h2>
        <Button onClick={downloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {reportData.totalOrders}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ₹{reportData.totalRevenue.toLocaleString()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm">Top Restaurant</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-sm font-medium">
            {reportData.topRestaurant ? reportData.topRestaurant.name : 'N/A'}
          </CardContent>
          <CardContent className="text-xs text-muted-foreground">
            {reportData.topRestaurant ? `${reportData.topRestaurant.orderCount} orders` : ''}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-sm">Active Restaurants</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {reportData.restaurantStats.length}
          </CardContent>
        </Card>
      </div>

      {/* Restaurant Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurant Name</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.restaurantStats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{stat.name}</TableCell>
                  <TableCell className="text-right">{stat.orderCount}</TableCell>
                  <TableCell className="text-right">₹{stat.revenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyReport;
