import pefile
import math

def get_entropy(data):
    if not data:
        return 0
    entropy = 0
    for x in range(256):
        p_x = float(data.count(x)) / len(data)
        if p_x > 0:
            entropy -= p_x * math.log2(p_x)
    return {
    "Machine": 332,
    "DebugSize": 0,
    "DebugRVA": 0,
    "MajorImageVersion": 0,
    "MajorOSVersion": 5,
    "ExportRVA": 0,
    "ExportSize": 0,
    "IatVRA": 0,
    "MajorLinkerVersion": 9,
    "MinorLinkerVersion": 0,
    "NumberOfSections": 5,
    "SizeOfStackReserve": 1000000,
    "DllCharacteristics": 0,
    "ResourceSize": 0,
    "BitcoinAddresses": 0
}


def extract_features(file_path):
    try:
        pe = pefile.PE(file_path)

        features = {}

        # ✅ Basic PE header features
        features["Machine"] = pe.FILE_HEADER.Machine
        features["DebugSize"]=getattr(pe.OPTIONAL_HEADER, "SizeOfHeapCommit", 0),
        features["DebugRVA"] =getattr(pe.OPTIONAL_HEADER, "AddressOfEntryPoint", 0),
        features["MajorImageVersion"]= pe.OPTIONAL_HEADER.MajorImageVersion,
        features["MajorOSVersion"] =pe.OPTIONAL_HEADER.MajorOperatingSystemVersion,
        features["ExportRVA"] = pe.OPTIONAL_HEADER.DATA_DIRECTORY[0].VirtualAddress,
        features["ExportSize"] = pe.OPTIONAL_HEADER.DATA_DIRECTORY[0].Size,
        features["IatVRA"] = pe.OPTIONAL_HEADER.DATA_DIRECTORY[1].VirtualAddress,
        features["MajorLinkerVersion"] = pe.OPTIONAL_HEADER.MajorLinkerVersion,
        features["MinorLinkerVersion"] = pe.OPTIONAL_HEADER.MinorLinkerVersion,
        features["NumberOfSections"] = pe.FILE_HEADER.NumberOfSections,
        features["SizeOfStackReserve"] = pe.OPTIONAL_HEADER.SizeOfStackReserve,
        features["DllCharacteristics"] = pe.OPTIONAL_HEADER.DllCharacteristics,
        features["ResourceSize"] = pe.OPTIONAL_HEADER.DATA_DIRECTORY[2].Size,
        features["BitcoinAddresses"] = 0

        # ✅ Sections info
        entropy_list = []
        raw_sizes = []

        for section in pe.sections:
            entropy_list.append(section.get_entropy())
            raw_sizes.append(section.SizeOfRawData)

        features["SectionsMeanEntropy"] = sum(entropy_list) / len(entropy_list) if entropy_list else 0
        features["SectionsMeanRawsize"] = sum(raw_sizes) / len(raw_sizes) if raw_sizes else 0

        # ✅ Imports count
        try:
            imports = sum([len(entry.imports) for entry in pe.DIRECTORY_ENTRY_IMPORT])
        except:
            imports = 0

        features["ImportsCount"] = imports

        # ✅ Exports
        try:
            exports = len(pe.DIRECTORY_ENTRY_EXPORT.symbols)
        except:
            exports = 0

        features["ExportCount"] = exports

        # ✅ Resources entropy
        try:
            resources = []
            for resource_type in pe.DIRECTORY_ENTRY_RESOURCE.entries:
                for resource_id in resource_type.directory.entries:
                    for resource_lang in resource_id.directory.entries:
                        data = pe.get_data(
                            resource_lang.data.struct.OffsetToData,
                            resource_lang.data.struct.Size
                        )
                        resources.append(get_entropy(data))

            features["ResourceEntropy"] = sum(resources) / len(resources) if resources else 0
        except:
            features["ResourceEntropy"] = 0

        return features

    except Exception as e:
        print("Feature extraction error:", str(e))
        raise Exception("Invalid PE file (not .exe)")