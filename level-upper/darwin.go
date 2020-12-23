// +build !windows darwin

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os/exec"

	"github.com/shirou/gopsutil/cpu"
)

func getCPUSpecs(profileJSON *map[string][](map[string]interface{}), info *SystemInfo) {
	cpuStat, err := cpu.Info()
	handle(err)
	info.CPUModel = cpuStat[0].ModelName
	info.CPUSpecs = (*profileJSON)["SPHardwareDataType"][0]["cpu_type"].(string)

}

func getMemorySpecs(profileJSON *map[string][](map[string]interface{}), info *SystemInfo) {
	info.Memory = (*profileJSON)["SPHardwareDataType"][0]["physical_memory"].(string)
}

func getBatterySpecs(profileJSON *map[string][](map[string]interface{}), info *SystemInfo) {
	health := (*profileJSON)["SPPowerDataType"][0]["sppower_battery_health_info"].(map[string]interface{})
	info.BatteryHealth = health["sppower_battery_health"].(string)
}

func getStorageSpecs(profileJSON *map[string][](map[string]interface{}), info *SystemInfo) {
	for _, storageDevice := range (*profileJSON)["SPStorageDataType"] {
		if storageDevice["_name"] == "Macintosh HD" {
			// Apples uses 1 billion bytes to a gigabyte, rather than 2^30
			info.HDCapacity = fmt.Sprintf("%d GB", int(storageDevice["size_in_bytes"].(float64)/1e9))
		}
	}
}

func getProductSpecs(profileJSON *map[string][](map[string]interface{}), info *SystemInfo) {
	hardwareInfo := (*profileJSON)["SPHardwareDataType"][0]
	info.SerialNumber = hardwareInfo["serial_number"].(string)
	info.DeviceModel = hardwareInfo["machine_model"].(string)
	info.DeviceFamily = "Not implemented on MacOS :("
	info.DeviceSKU = "Not implemented on MacOS :("
}

func profileSystem() *SystemInfo {
	info := new(SystemInfo)
	cmd := exec.Command("system_profiler", "-json", "SPHardwareDataType", "SPStorageDataType", "SPPowerDataType")
	response, err := cmd.Output()
	if err != nil {
		log.Fatal(err)
	}

	var profileJSON map[string][](map[string]interface{})

	err = json.Unmarshal(response, &profileJSON)
	handle(err)

	getCPUSpecs(&profileJSON, info)
	getBatterySpecs(&profileJSON, info)
	getStorageSpecs(&profileJSON, info)
	getMemorySpecs(&profileJSON, info)
	getProductSpecs(&profileJSON, info)
	return info
}
