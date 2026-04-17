def extract_features(log):
    return [
        log["file_entropy"],
        log["write_frequency"],
        log["rename_count"],
        log["cpu_usage"]
    ]