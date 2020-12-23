package main

import "log"

const bytesToGibibyte = 1024 * 1024 * 1024

// SystemInfo is infor about the system
type SystemInfo struct {
	CPUModel      string
	CPUSpecs      string
	Memory        string
	BatteryHealth string
	HDCapacity    string
	SerialNumber  string
	DeviceModel   string
	DeviceFamily  string
	DeviceSKU     string
}

func handle(err error) {
	if err != nil {
		log.Println(err)
	}
}
