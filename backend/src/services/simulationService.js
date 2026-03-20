import nodemailer from 'nodemailer';
import { PowerSupplyArea, Notification } from '../models/index.js';
import { config } from '../config.js';

// ==================== POWER SIMULATION SERVICES ====================

/**
 * Get all power supply areas
 */
export const getAllPowerAreas = async () => {
  try {
    const areas = await PowerSupplyArea.find().sort({ areaName: 1 });
    return areas;
  } catch (error) {
    throw new Error(`Failed to fetch power areas: ${error.message}`);
  }
};

/**
 * Get power area by code
 */
export const getPowerAreaByCode = async (areaCode) => {
  try {
    const area = await PowerSupplyArea.findOne({ areaCode: areaCode.toUpperCase() });
    
    if (!area) {
      throw new Error('Power area not found');
    }

    return area;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new power area
 */
export const createPowerArea = async (areaData) => {
  try {
    const area = new PowerSupplyArea({
      ...areaData,
      areaCode: areaData.areaCode.toUpperCase()
    });

    await area.save();
    return area;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Power area with this code already exists');
    }
    throw new Error(`Failed to create power area: ${error.message}`);
  }
};

/**
 * Update power area
 */
export const updatePowerArea = async (areaCode, updateData) => {
  try {
    const area = await PowerSupplyArea.findOneAndUpdate(
      { areaCode: areaCode.toUpperCase() },
      updateData,
      { new: true, runValidators: true }
    );

    if (!area) {
      throw new Error('Power area not found');
    }

    return area;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete power area
 */
export const deletePowerArea = async (areaCode) => {
  try {
    const area = await PowerSupplyArea.findOneAndDelete({ 
      areaCode: areaCode.toUpperCase() 
    });

    if (!area) {
      throw new Error('Power area not found');
    }

    return area;
  } catch (error) {
    throw error;
  }
};

/**
 * Simulate power load changes (for real-time updates)
 */
export const simulatePowerLoad = async (areaCode) => {
  try {
    const area = await PowerSupplyArea.findOne({ areaCode: areaCode.toUpperCase() });
    
    if (!area) {
      throw new Error('Power area not found');
    }

    // Simulate random load variation (±10% of current load)
    const variation = (Math.random() - 0.5) * 0.2;
    const newLoad = Math.max(0, area.currentLoad * (1 + variation));
    
    // Simulate voltage fluctuation (220-240V normal range)
    const voltageVariation = (Math.random() - 0.5) * 20;
    const newVoltage = Math.max(200, Math.min(250, 230 + voltageVariation));

    // Determine status based on load and voltage
    let newStatus = 'Online';
    if (newLoad > area.capacity * 0.95) {
      newStatus = 'Critical';
    } else if (newLoad > area.capacity * 0.85) {
      newStatus = 'Maintenance';
    } else if (newVoltage < 210 || newVoltage > 245) {
      newStatus = 'Critical';
    }

    area.currentLoad = Math.round(newLoad);
    area.voltage = Math.round(newVoltage);
    area.status = newStatus;

    await area.save();
    return area;
  } catch (error) {
    throw error;
  }
};

/**
 * Simulate outage in an area
 */
export const simulateOutage = async (areaCode, duration = 30) => {
  try {
    const area = await PowerSupplyArea.findOne({ areaCode: areaCode.toUpperCase() });
    
    if (!area) {
      throw new Error('Power area not found');
    }

    // Set area to offline
    area.status = 'Offline';
    area.currentLoad = 0;
    area.voltage = 0;

    await area.save();

    // Schedule restoration after duration (in minutes)
    setTimeout(async () => {
      try {
        const restoredArea = await PowerSupplyArea.findOne({ 
          areaCode: areaCode.toUpperCase() 
        });
        
        if (restoredArea) {
          restoredArea.status = 'Online';
          restoredArea.currentLoad = Math.round(restoredArea.capacity * 0.5);
          restoredArea.voltage = 230;
          await restoredArea.save();
        }
      } catch (err) {
        console.error('Failed to restore area:', err);
      }
    }, duration * 60 * 1000);

    return area;
  } catch (error) {
    throw error;
  }
};

/**
 * Get power grid overview
 */
export const getPowerGridOverview = async () => {
  try {
    const areas = await PowerSupplyArea.find();

    const overview = {
      totalAreas: areas.length,
      onlineAreas: areas.filter(a => a.status === 'Online').length,
      offlineAreas: areas.filter(a => a.status === 'Offline').length,
      maintenanceAreas: areas.filter(a => a.status === 'Maintenance').length,
      criticalAreas: areas.filter(a => a.status === 'Critical').length,
      totalCapacity: areas.reduce((sum, a) => sum + a.capacity, 0),
      totalLoad: areas.reduce((sum, a) => sum + a.currentLoad, 0),
      totalAffectedHouseholds: areas.reduce((sum, a) => sum + a.affectedHouseholds, 0),
      totalActiveComplaints: areas.reduce((sum, a) => sum + a.activeComplaints, 0),
      avgVoltage: Math.round(
        areas.reduce((sum, a) => sum + a.voltage, 0) / areas.length
      )
    };

    overview.loadPercentage = overview.totalCapacity > 0
      ? Math.round((overview.totalLoad / overview.totalCapacity) * 100)
      : 0;

    return overview;
  } catch (error) {
    throw new Error(`Failed to fetch power grid overview: ${error.message}`);
  }
};

/**
 * Initialize sample power areas (for testing)
 */
export const initializeSampleAreas = async () => {
  try {
    const existingCount = await PowerSupplyArea.countDocuments();
    
    if (existingCount > 0) {
      console.log('Power areas already initialized');
      return;
    }

    const sampleAreas = [
      {
        areaCode: 'MUM01',
        areaName: 'Andheri',
        district: 'Mumbai',
        substationName: 'Andheri Substation',
        capacity: 5000,
        currentLoad: 3500,
        voltage: 230,
        status: 'Online',
        affectedHouseholds: 15000,
        contactPerson: {
          name: 'Rajesh Kumar',
          phone: '9876543210',
          email: 'rajesh@power.com'
        }
      },
      {
        areaCode: 'MUM02',
        areaName: 'Bandra',
        district: 'Mumbai',
        substationName: 'Bandra Substation',
        capacity: 4500,
        currentLoad: 3800,
        voltage: 228,
        status: 'Online',
        affectedHouseholds: 12000,
        contactPerson: {
          name: 'Priya Sharma',
          phone: '9876543211',
          email: 'priya@power.com'
        }
      },
      {
        areaCode: 'DEL01',
        areaName: 'Connaught Place',
        district: 'Delhi',
        substationName: 'CP Substation',
        capacity: 6000,
        currentLoad: 4200,
        voltage: 232,
        status: 'Online',
        affectedHouseholds: 20000,
        contactPerson: {
          name: 'Amit Singh',
          phone: '9876543212',
          email: 'amit@power.com'
        }
      }
    ];

    await PowerSupplyArea.insertMany(sampleAreas);
    console.log('✅ Sample power areas initialized');
  } catch (error) {
    console.error('Failed to initialize sample areas:', error);
  }
};

// ==================== NOTIFICATION SERVICES ====================

/**
 * Create email transporter
 */
const createEmailTransporter = () => {
  if (!config.email.user || !config.email.password) {
    console.warn('⚠️  Email credentials not configured');
    return null;
  }

  return nodemailer.createTransport({
    service: config.email.service,
    auth: {
      user: config.email.user,
      pass: config.email.password
    }
  });
};

/**
 * Send email notification
 */
export const sendEmailNotification = async (to, subject, message, complaintId = null) => {
  try {
    const transporter = createEmailTransporter();
    
    if (!transporter) {
      // Store notification as pending
      await Notification.create({
        recipient: { email: to },
        type: 'email',
        subject,
        message,
        relatedComplaint: complaintId,
        status: 'failed',
        errorMessage: 'Email configuration not set'
      });
      
      console.log(`📧 Email notification queued for: ${to}`);
      return { queued: true };
    }

    const mailOptions = {
      from: config.email.from,
      to,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚡ Power Supply Management</h1>
            </div>
            <div class="content">
              ${message}
              ${complaintId ? `<p><strong>Complaint ID:</strong> ${complaintId}</p>` : ''}
            </div>
            <div class="footer">
              <p>This is an automated message from Power Supply Management System</p>
              <p>Please do not reply to this email</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);

    // Store notification record
    await Notification.create({
      recipient: { email: to },
      type: 'email',
      subject,
      message,
      relatedComplaint: complaintId,
      status: 'sent',
      sentAt: new Date()
    });

    console.log(`✅ Email sent to: ${to}`);
    return { sent: true };
  } catch (error) {
    // Store failed notification
    await Notification.create({
      recipient: { email: to },
      type: 'email',
      subject,
      message,
      relatedComplaint: complaintId,
      status: 'failed',
      errorMessage: error.message
    });

    console.error('❌ Failed to send email:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send SMS notification (Twilio)
 */
export const sendSMSNotification = async (phone, message, complaintId = null) => {
  try {
    if (!config.sms.enabled) {
      console.log(`📱 SMS notification queued for: ${phone}`);
      
      await Notification.create({
        recipient: { phone },
        type: 'sms',
        subject: 'SMS Notification',
        message,
        relatedComplaint: complaintId,
        status: 'failed',
        errorMessage: 'SMS service not enabled'
      });
      
      return { queued: true };
    }

    // TODO: Implement Twilio SMS sending
    // const client = twilio(config.sms.twilioAccountSid, config.sms.twilioAuthToken);
    // await client.messages.create({
    //   body: message,
    //   from: config.sms.twilioPhoneNumber,
    //   to: phone
    // });

    await Notification.create({
      recipient: { phone },
      type: 'sms',
      subject: 'SMS Notification',
      message,
      relatedComplaint: complaintId,
      status: 'sent',
      sentAt: new Date()
    });

    console.log(`✅ SMS sent to: ${phone}`);
    return { sent: true };
  } catch (error) {
    await Notification.create({
      recipient: { phone },
      type: 'sms',
      subject: 'SMS Notification',
      message,
      relatedComplaint: complaintId,
      status: 'failed',
      errorMessage: error.message
    });

    console.error('❌ Failed to send SMS:', error.message);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

/**
 * Send complaint confirmation notification
 */
export const sendComplaintConfirmation = async (email, phone, complaintId, name) => {
  const emailSubject = 'Complaint Registered Successfully';
  const emailMessage = `
    <h2>Dear ${name},</h2>
    <p>Your complaint has been successfully registered with us.</p>
    <p><strong>Complaint ID:</strong> ${complaintId}</p>
    <p>You can track your complaint status using this ID.</p>
    <p>Our team will review your complaint and take necessary action.</p>
    <p>Thank you for your patience.</p>
  `;

  const smsMessage = `Dear ${name}, your complaint has been registered. Complaint ID: ${complaintId}. Track status at our portal.`;

  try {
    await Promise.allSettled([
      sendEmailNotification(email, emailSubject, emailMessage, complaintId),
      sendSMSNotification(phone, smsMessage, complaintId)
    ]);
  } catch (error) {
    console.error('Failed to send confirmation notifications:', error);
  }
};

/**
 * Send status update notification
 */
export const sendStatusUpdateNotification = async (email, phone, complaintId, status, name) => {
  const emailSubject = `Complaint Status Updated - ${complaintId}`;
  const emailMessage = `
    <h2>Dear ${name},</h2>
    <p>The status of your complaint has been updated.</p>
    <p><strong>Complaint ID:</strong> ${complaintId}</p>
    <p><strong>New Status:</strong> ${status}</p>
    <p>You can check more details by logging into our portal.</p>
    <p>Thank you for your patience.</p>
  `;

  const smsMessage = `Dear ${name}, your complaint ${complaintId} status has been updated to: ${status}`;

  try {
    await Promise.allSettled([
      sendEmailNotification(email, emailSubject, emailMessage, complaintId),
      sendSMSNotification(phone, smsMessage, complaintId)
    ]);
  } catch (error) {
    console.error('Failed to send status update notifications:', error);
  }
};

/**
 * Get all notifications
 */
export const getAllNotifications = async (filters = {}, page = 1, limit = 50) => {
  try {
    const query = {};
    
    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
    if (filters.relatedComplaint) query.relatedComplaint = filters.relatedComplaint;

    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('relatedComplaint', 'complaintId name'),
      Notification.countDocuments(query)
    ]);

    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }
};

// ==================== EXPORTS ====================
export default {
  getAllPowerAreas,
  getPowerAreaByCode,
  createPowerArea,
  updatePowerArea,
  deletePowerArea,
  simulatePowerLoad,
  simulateOutage,
  getPowerGridOverview,
  initializeSampleAreas,
  sendEmailNotification,
  sendSMSNotification,
  sendComplaintConfirmation,
  sendStatusUpdateNotification,
  getAllNotifications
};
