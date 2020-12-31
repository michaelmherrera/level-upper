// +build windows !darwin

package main

import (
	"bufio"
	"fmt"
	"strings"

	"github.com/jaypipes/ghw"
)

func removeBlankLines(raw string) string {
	lines := make([]string, 0)
	scanner := bufio.NewScanner(strings.NewReader(string(raw)))
	for scanner.Scan() {
		line := scanner.Text()
		if len(line) == 1 || line[0] == '\r' {
			// If it's a blank line
			continue
		}
		lines = append(lines, line)
	}
	return strings.Join(lines, "\n")
}

func toMap(raw string) map[string]string {
	properties := make(map[string]string)
	scanner := bufio.NewScanner(strings.NewReader(string(raw)))
	for scanner.Scan() {
		line := scanner.Text()
		if len(line) == 1 || line[0] == '\r' {
			// If it's a blank line
			continue
		}
		line = strings.Trim(line, "\r")
		// Split based on "=" delimiter
		pair := strings.Split(line, "=")
		properties[pair[0]] = pair[1]
	}
	return properties
}

func getCPUSpecs(info *SystemInfo) {
	cpu, err := ghw.CPU()
	handle(err)
	info.CPUModel = cpu.Processors[0].Model
	info.CPUSpecs = fmt.Sprintf("%d Cores", cpu.Processors[0].NumCores)
}

func getMemorySpecs(info *SystemInfo) {
	mem, err := ghw.Memory()
	handle(err)
	info.Memory = fmt.Sprintf("%d GB", mem.TotalPhysicalBytes/bytesToGibibyte)
}

func getBatterySpecs(info *SystemInfo) {
	info.BatteryHealth = "Not implemented for Windows :("
}

func getProductSpecs(info *SystemInfo) {
	// TODO: Get more in-depth info about the product
	prod, err := ghw.Product()
	handle(err)
	info.DeviceModel = prod.Name
	info.SerialNumber = prod.SerialNumber
	info.DeviceFamily = prod.Family
	info.DeviceSKU = prod.SKU
}

func getStorageSpecs(info *SystemInfo) {
	storage, err := ghw.Block()
	handle(err)
	hdString := ""
	for i, drive := range storage.Disks {
		if i != 0 {
			hdString += " and "
		}
		hdString += fmt.Sprintf("%d GB %s", drive.SizeBytes/bytesToGibibyte, drive.DriveType)
	}
	info.HDCapacity = hdString
}

func profileSystem() *SystemInfo {
	info := SystemInfo{
		CPUModel:      "Intel",
		CPUSpecs:      "Cores!",
		Memory:        "1.21 Gigabytes",
		BatteryHealth: "Stellar",
		HDCapacity:    "Titanic",
		SerialNumber:  "Frosted Flakes",
		DeviceModel:   "The Death Star"}
	getCPUSpecs(&info)
	getMemorySpecs(&info)
	getBatterySpecs(&info)
	getStorageSpecs(&info)
	getProductSpecs(&info)
	return &info
}
